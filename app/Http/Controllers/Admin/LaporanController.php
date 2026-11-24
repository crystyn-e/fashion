<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\Barang;
use App\Exports\BarangExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index()
    {
        $stats = [
            'totalTransaksi' => Transaksi::count(),
            'totalPendapatan' => Transaksi::where('status', 'selesai')->sum('total_harga'),
            'barangTerpopuler' => Barang::orderBy('total_disewa', 'desc')->first()?->nama_barang ?? '-',
        ];

        return Inertia::render('Admin/Laporan/Index', [
            'stats' => $stats
        ]);
    }

    public function transaksi(Request $request)
    {
        $query = Transaksi::with('pelanggan');

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $transaksis = $query->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($t) {
                // HITUNG DENDA BERDASARKAN TANGGAL KEMBALI
                $denda = 0;
                if ($t->tgl_kembali && $t->tgl_kembali > $t->tgl_harus_kembali) {
                    $hariTerlambat = $t->tgl_harus_kembali->diffInDays($t->tgl_kembali);
                    $denda = $hariTerlambat * 50000;
                }

                // ATAU jika belum ada tgl_kembali, gunakan denda dari database
                if ($denda == 0 && $t->denda > 0) {
                    $denda = $t->denda;
                }

                $totalHarga = is_numeric($t->total_harga) ? floatval($t->total_harga) : 0;
                $dp = is_numeric($t->dp) ? floatval($t->dp) : 0;

                return [
                    'id' => $t->id,
                    'kode_transaksi' => $t->kode_transaksi,
                    'pelanggan' => $t->pelanggan?->nama ?? 'Walk-in',
                    'tgl_sewa' => $t->tgl_sewa->format('d/m/Y'),
                    'tgl_harus_kembali' => $t->tgl_harus_kembali->format('d/m/Y'),
                    'tgl_kembali' => $t->tgl_kembali?->format('d/m/Y'),
                    'total_harga' => $totalHarga,
                    'dp' => $dp,
                    'sisa' => floatval($t->sisa_pembayaran),
                    'denda' => $denda,
                    'deposit_tipe' => $t->deposit_tipe === 'uang' ? 'Uang' : 'KTP',
                    'status' => $t->status,
                    'created_at' => $t->created_at->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('Admin/Laporan/Transaksi', [
            'transaksis' => $transaksis,
            'filters' => $request->only(['start_date', 'end_date', 'status']),
        ]);
    }

    private function nextTransactionReportDocumentNumber(): string
    {
        return DB::transaction(function () {
            $sequence = DB::table('pdf_document_sequences')
                ->where('key', 'transaction_report')
                ->lockForUpdate()
                ->first();

            if (!$sequence) {
                throw new \RuntimeException('Nomor dokumen laporan tidak ditemukan.');
            }

            if ($sequence->last_number >= 9999) {
                throw new \RuntimeException('Nomor dokumen laporan telah mencapai batas 9999.');
            }

            $nextNumber = (int) $sequence->last_number + 1;
            DB::table('pdf_document_sequences')
                ->where('key', 'transaction_report')
                ->update(['last_number' => $nextNumber]);

            return 'BSH-' . str_pad((string) $nextNumber, 4, '0', STR_PAD_LEFT);
        });
    }

    public function exportTransaksiPdf(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|in:proses,sewa,selesai,batal',
        ]);

        $startDate = $validated['start_date'] ?? null;
        $endDate = $validated['end_date'] ?? null;
        $query = Transaksi::with('pelanggan');

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $transaksiRecords = $query->orderBy('created_at', 'desc')->get();
        $transaksis = $transaksiRecords
            ->map(function ($transaksi) {
                $denda = 0;
                if ($transaksi->tgl_kembali && $transaksi->tgl_kembali > $transaksi->tgl_harus_kembali) {
                    $denda = $transaksi->tgl_harus_kembali->diffInDays($transaksi->tgl_kembali) * 50000;
                }
                if ($denda == 0 && $transaksi->denda > 0) {
                    $denda = $transaksi->denda;
                }

                return [
                    'kode_transaksi' => $transaksi->kode_transaksi,
                    'pelanggan' => $transaksi->pelanggan?->nama ?? 'Walk-in',
                    'tgl_sewa' => $transaksi->tgl_sewa->format('d/m/Y'),
                    'tgl_kembali' => $transaksi->tgl_kembali?->format('d/m/Y') ?? '-',
                    'total_harga' => (float) $transaksi->total_harga,
                    'dp' => (float) $transaksi->dp,
                    'denda' => (float) $denda,
                    'status' => $transaksi->status,
                ];
            });

        $logoPath = public_path('images/logo-boesafashion.jpg');
        if (!is_file($logoPath)) {
            throw new \RuntimeException('Logo laporan tidak ditemukan.');
        }

        $printedAt = now()->format('d/m/Y H:i:s');
        $printedDate = now()->locale('id')->translatedFormat('d F Y');
        $documentNumber = $this->nextTransactionReportDocumentNumber();
        $startDateLabel = $startDate
            ? Carbon::parse($startDate)->format('d/m/Y')
            : ($transaksiRecords->last()?->created_at?->format('d/m/Y') ?? '-');
        $endDateLabel = $endDate
            ? Carbon::parse($endDate)->format('d/m/Y')
            : ($transaksiRecords->first()?->created_at?->format('d/m/Y') ?? '-');
        $pdf = Pdf::loadView('pdf.laporan-transaksi', [
            'transaksis' => $transaksis,
            'startDate' => $startDateLabel,
            'endDate' => $endDateLabel,
            'status' => $validated['status'] ?? null,
            'printedAt' => $printedAt,
            'printedDate' => $printedDate,
            'documentNumber' => $documentNumber,
            'logo' => 'data:image/jpeg;base64,' . base64_encode(file_get_contents($logoPath)),
        ])->setPaper('a4');

        $pdf->render();
        $dompdf = $pdf->getDomPDF();
        $canvas = $dompdf->getCanvas();
        $fontMetrics = $dompdf->getFontMetrics();
        $font = $fontMetrics->getFont('DejaVu Sans', 'normal');
        $pageText = 'Halaman {PAGE_NUM} dari {PAGE_COUNT}';
        $pageTextWidth = $fontMetrics->getTextWidth($pageText, $font, 8);
        $canvas->page_text(
            $canvas->get_width() - 32 - $pageTextWidth,
            $canvas->get_height() - 18,
            $pageText,
            $font,
            8,
            [90, 90, 90]
        );

        return $pdf->download(
            'laporan-transaksi-' . ($startDate ?? 'semua') . '-' . ($endDate ?? 'tanggal') . '.pdf'
        );
    }

    public function barang()
    {
        $barangs = Barang::withCount('detailTransaksis')
            ->with('kategori')
            ->orderBy('total_disewa', 'desc')
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'kode_barang' => $b->kode_barang,
                    'nama_barang' => $b->nama_barang,
                    'kategori' => $b->kategori?->nama_kategori ?? '-',
                    'ukuran' => $b->ukuran ?? '-',
                    'warna' => $b->warna ?? '-',
                    'harga_sewa' => floatval($b->harga_sewa),
                    'stok' => $b->stok,
                    'total_disewa' => $b->detail_transaksis_count,
                    'total_pendapatan' => $b->detail_transaksis_count * floatval($b->harga_sewa),
                    'status' => $b->status,
                ];
            });

        return Inertia::render('Admin/Laporan/Barang', [
            'barangs' => $barangs
        ]);
    }

    public function exportBarang()
    {
        return Excel::download(new BarangExport, 'laporan-barang.xlsx');
    }
}
