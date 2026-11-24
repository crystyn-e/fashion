<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KoleksiController extends Controller
{
    public function index(Request $request)
    {
        $query = Barang::with('kategori');

        // Filter by status (jika ada parameter status)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by kategori
        if ($request->filled('kategori')) {
            $query->where('kategori_id', $request->kategori);
        }

        // Filter by search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nama_barang', 'LIKE', "%{$request->search}%")
                    ->orWhere('deskripsi', 'LIKE', "%{$request->search}%");
            });
        }

        $barangs = $query->latest()->get()->map(function ($barang) {
            return [
                'id' => $barang->id,
                'nama_barang' => $barang->nama_barang,
                'slug' => $barang->slug,
                'kategori' => $barang->kategori ? $barang->kategori->nama_kategori : 'Umum',
                'kategori_id' => $barang->kategori_id,
                'harga_sewa' => $barang->harga_sewa,
                'ukuran' => $barang->ukuran,
                'warna' => $barang->warna,
                'deskripsi' => $barang->deskripsi,
                'gambar' => $barang->gambar_utama ? '/storage/' . $barang->gambar_utama : null,
                'gambar_position_x' => $barang->gambar_position_x,
                'gambar_position_y' => $barang->gambar_position_y,
                'status' => $barang->status, // TERSEDIA / DISEWA / MAINTENANCE
                'badge' => $barang->created_at->gt(now()->subDays(7)) ? 'NEW' : null,
            ];
        });

        $kategoris = Kategori::where('is_active', true)
            ->orderBy('urutan')
            ->orderBy('nama_kategori')
            ->get()
            ->map(function ($kategori) {
                return [
                    'id' => $kategori->id,
                    'nama_kategori' => $kategori->nama_kategori,
                ];
            });

        return Inertia::render('Koleksi/Index', [
            'barangs' => $barangs,
            'kategoris' => $kategoris
        ]);
    }

    public function show($slug)
    {
        $barang = Barang::with('kategori')
            ->where('slug', $slug)
            ->firstOrFail();

        $barangTerkait = Barang::with('kategori')
            ->where('kategori_id', $barang->kategori_id)
            ->where('id', '!=', $barang->id)
            ->limit(4)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_barang' => $item->nama_barang,
                    'slug' => $item->slug,
                    'harga_sewa' => $item->harga_sewa,
                    'gambar' => $item->gambar_utama ? '/storage/' . $item->gambar_utama : null,
                    'gambar_position_x' => $item->gambar_position_x,
                    'gambar_position_y' => $item->gambar_position_y,
                    'status' => $item->status,
                ];
            });

        return Inertia::render('Koleksi/Show', [
            'barang' => [
                'id' => $barang->id,
                'nama_barang' => $barang->nama_barang,
                'kategori' => $barang->kategori ? $barang->kategori->nama_kategori : 'Umum',
                'harga_sewa' => $barang->harga_sewa,
                'ukuran' => $barang->ukuran,
                'warna' => $barang->warna,
                'deskripsi' => $barang->deskripsi,
                'gambar' => $barang->gambar_utama ? '/storage/' . $barang->gambar_utama : null,
                'gambar_position_x' => $barang->gambar_position_x,
                'gambar_position_y' => $barang->gambar_position_y,
                'status' => $barang->status,
            ],
            'barangTerkait' => $barangTerkait
        ]);
    }
}
