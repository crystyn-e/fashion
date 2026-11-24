<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BarangController extends Controller
{
    // FUNGSI HELPER UNTUK MEMBERSIHKAN FORMAT HARGA
    private function cleanPrice($price)
    {
        // Hapus titik (pemisah ribuan), spasi, dan koma
        $clean = str_replace(['.', ' ', ','], '', $price);
        // Konversi ke integer
        return (int) $clean;
    }

    public function index()
    {
        $barangs = Barang::with('kategori')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn($barang) => [
                'id' => $barang->id,
                'kode_barang' => $barang->kode_barang,
                'nama_barang' => $barang->nama_barang,
                'slug' => $barang->slug,
                'kategori_id' => $barang->kategori_id,
                'kategori' => $barang->kategori ? [
                    'id' => $barang->kategori->id,
                    'nama_kategori' => $barang->kategori->nama_kategori,
                ] : null,
                'ukuran' => $barang->ukuran,
                'warna' => $barang->warna,
                'harga_sewa' => (float) $barang->harga_sewa,
                'stok' => $barang->stok,
                'status' => $barang->status,
                'gambar' => $barang->gambar_utama,
            ]);

        $kategoris = Kategori::where('is_active', true)->get();

        return Inertia::render('Admin/Barang/Index', [
            'barangs' => $barangs,
            'kategoris' => $kategoris
        ]);
    }

    public function create()
    {
        $kategoris = Kategori::where('is_active', true)->get();

        return Inertia::render('Admin/Barang/Create', [
            'kategoris' => $kategoris
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_barang' => 'nullable|string|max:20|unique:barangs',
            'nama_barang' => 'required|string|max:100',
            'kategori_id' => 'required|exists:kategoris,id',
            'ukuran' => 'nullable|string|max:50',
            'warna' => 'nullable|string|max:30',
            'harga_sewa' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:tersedia,disewa,maintenance',
            'gambar_utama' => 'nullable|image|max:2048',
            'gambar_position_x' => 'required|integer|min:0|max:100',
            'gambar_position_y' => 'required|integer|min:0|max:100',
        ]);

        $data = $request->except('gambar_utama');
        $data['slug'] = Str::slug($request->nama_barang);

        // PERBAIKI: Bersihkan format harga
        $data['harga_sewa'] = $this->cleanPrice($request->harga_sewa);

        // Generate kode_barang otomatis jika tidak diisi
        if (empty($data['kode_barang'])) {
            $lastBarang = Barang::orderBy('id', 'desc')->first();
            $lastNumber = $lastBarang ? intval(substr($lastBarang->kode_barang, -4)) : 0;
            $data['kode_barang'] = 'BRG-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        }

        if ($request->hasFile('gambar_utama')) {
            $path = $request->file('gambar_utama')->store('barang', 'public');
            $data['gambar_utama'] = $path;
        }

        Barang::create($data);

        return redirect()->route('admin.barang.index')
            ->with('success', 'Barang berhasil ditambahkan');
    }

    public function show($id)
    {
        $barang = Barang::with('kategori')->findOrFail($id);

        return Inertia::render('Admin/Barang/Show', [
            'barang' => [
                'id' => $barang->id,
                'kode_barang' => $barang->kode_barang,
                'nama_barang' => $barang->nama_barang,
                'slug' => $barang->slug,
                'kategori' => $barang->kategori ? [
                    'id' => $barang->kategori->id,
                    'nama_kategori' => $barang->kategori->nama_kategori,
                ] : null,
                'ukuran' => $barang->ukuran,
                'warna' => $barang->warna,
                'harga_sewa' => (float) $barang->harga_sewa,
                'stok' => $barang->stok,
                'deskripsi' => $barang->deskripsi,
                'status' => $barang->status,
                'gambar_utama' => $barang->gambar_utama,
                'gambar_position_x' => $barang->gambar_position_x,
                'gambar_position_y' => $barang->gambar_position_y,
            ]
        ]);
    }

    public function edit($id)
    {
        $barang = Barang::findOrFail($id);
        $kategoris = Kategori::where('is_active', true)->get();

        return Inertia::render('Admin/Barang/Edit', [
            'barang' => [
                'id' => $barang->id,
                'kode_barang' => $barang->kode_barang,
                'nama_barang' => $barang->nama_barang,
                'kategori_id' => $barang->kategori_id,
                'ukuran' => $barang->ukuran,
                'warna' => $barang->warna,
                'harga_sewa' => (float) $barang->harga_sewa,
                'stok' => $barang->stok,
                'deskripsi' => $barang->deskripsi,
                'status' => $barang->status,
                'gambar_utama' => $barang->gambar_utama,
            ],
            'kategoris' => $kategoris
        ]);
    }

    public function update(Request $request, $id)
    {
        $barang = Barang::findOrFail($id);

        $request->validate([
            'kode_barang' => 'required|string|max:20|unique:barangs,kode_barang,' . $id,
            'nama_barang' => 'required|string|max:100',
            'kategori_id' => 'required|exists:kategoris,id',
            'ukuran' => 'nullable|string|max:50',
            'warna' => 'nullable|string|max:30',
            'harga_sewa' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:tersedia,disewa,maintenance',
            'gambar_position_x' => 'required|integer|min:0|max:100',
            'gambar_position_y' => 'required|integer|min:0|max:100',
        ]);

        $data = $request->except('gambar_utama');
        $data['slug'] = Str::slug($request->nama_barang);

        // PERBAIKI: Bersihkan format harga
        $data['harga_sewa'] = $this->cleanPrice($request->harga_sewa);

        if ($request->hasFile('gambar_utama')) {
            // Hapus gambar lama jika ada
            if ($barang->gambar_utama) {
                Storage::disk('public')->delete($barang->gambar_utama);
            }
            $path = $request->file('gambar_utama')->store('barang', 'public');
            $data['gambar_utama'] = $path;
        }

        $barang->update($data);

        return redirect()->route('admin.barang.index')
            ->with('success', 'Barang berhasil diupdate');
    }

    public function destroy($id)
    {
        $barang = Barang::findOrFail($id);

        // Cek apakah barang sedang disewa
        if ($barang->status === 'disewa') {
            return back()->with('error', 'Tidak dapat menghapus barang yang sedang disewa');
        }

        // Hapus gambar jika ada
        if ($barang->gambar_utama) {
            Storage::disk('public')->delete($barang->gambar_utama);
        }

        $barang->delete();

        return redirect()->route('admin.barang.index')
            ->with('success', 'Barang berhasil dihapus');
    }
}
