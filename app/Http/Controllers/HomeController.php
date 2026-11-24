<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Ambil produk terbaru yang tersedia atau sedang disewa
        $barangTerbaru = Barang::with('kategori')
            ->whereIn('status', ['tersedia', 'disewa'])
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($barang) {
                return [
                    'id' => $barang->id,
                    'nama_barang' => $barang->nama_barang,
                    'slug' => $barang->slug,
                    'harga_sewa' => $barang->harga_sewa,
                    'gambar_utama' => $barang->gambar_utama,  // <-- INI YANG BENAR
                    'gambar_position_x' => $barang->gambar_position_x,
                    'gambar_position_y' => $barang->gambar_position_y,
                    'status' => $barang->status,
                    'badge' => $barang->badge ?? null,
                    'kategori' => $barang->kategori ? [
                        'id' => $barang->kategori->id,
                        'nama_kategori' => $barang->kategori->nama_kategori
                    ] : null,
                ];
            });

        // Ambil kategori yang aktif
        $kategoris = Kategori::where('is_active', true)
            ->withCount('barangs')
            ->get()
            ->map(function ($kategori) {
                return [
                    'id' => $kategori->id,
                    'nama_kategori' => $kategori->nama_kategori,
                    'barang_count' => $kategori->barangs_count,
                ];
            });

        // Debug: cek nilai gambar_utama
        \Log::info('Barang Terbaru Count: ' . $barangTerbaru->count());
        if ($barangTerbaru->count() > 0) {
            \Log::info('Contoh gambar_utama: ' . $barangTerbaru->first()['gambar_utama']);
        }

        return Inertia::render('Home', [
            'featuredProducts' => $barangTerbaru,
            'categories' => $kategoris,
        ]);
    }

    public function tentang()
    {
        return Inertia::render('Tentang');
    }

    public function kontak()
    {
        return Inertia::render('Kontak');
    }
}
