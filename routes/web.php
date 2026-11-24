<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KoleksiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\BarangController as AdminBarangController;
use App\Http\Controllers\Admin\KategoriController as AdminKategoriController;
use App\Http\Controllers\Admin\LaporanController as AdminLaporanController;
use App\Http\Controllers\Pelayan\DashboardController as PelayanDashboardController;
use App\Http\Controllers\Pelayan\TransaksiController as PelayanTransaksiController;
use App\Http\Controllers\Pelayan\PengembalianController as PelayanPengembalianController;
use App\Http\Controllers\Pelayan\PelangganController as PelayanPelangganController;
use App\Http\Controllers\Pelayan\BarangController as PelayanBarangController;
use Inertia\Inertia;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\AdminContactController; // ← TAMBAHKAN INI

// =========== HALAMAN PUBLIC (SEMUA ORANG BISA LIHAT) ===========
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang', [HomeController::class, 'tentang'])->name('tentang');
Route::get('/kontak', [HomeController::class, 'kontak'])->name('kontak');
Route::get('/koleksi', [KoleksiController::class, 'index'])->name('koleksi.index');
Route::get('/koleksi/{slug}', [KoleksiController::class, 'show'])->name('koleksi.show');

// =========== AUTHENTICATION (LOGIN) ===========
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// =========== ROUTES ADMIN (HANYA ADMIN) ===========
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Manajemen Staf
    Route::resource('users', AdminUserController::class);
    Route::post('/users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('users.reset-password');
    Route::put('/users/{user}/toggle-active', [AdminUserController::class, 'toggleActive'])->name('users.toggle-active');

    // Manajemen Barang
    Route::resource('barang', AdminBarangController::class);

    // Manajemen Kategori
    Route::resource('kategori', AdminKategoriController::class);

    // Laporan
    Route::get('/laporan', [AdminLaporanController::class, 'index'])->name('laporan.index');
    Route::get('/laporan/transaksi', [AdminLaporanController::class, 'transaksi'])->name('laporan.transaksi');
    Route::get('/laporan/transaksi/export-pdf', [AdminLaporanController::class, 'exportTransaksiPdf'])->name('laporan.transaksi.export-pdf');
    Route::get('/laporan/barang', [AdminLaporanController::class, 'barang'])->name('laporan.barang');

    // ========== MANAJEMEN PESAN KONTAK (MENGGUNAKAN AdminContactController) ==========
    Route::get('/contacts/unread-count', [AdminContactController::class, 'unreadCount'])->name('contacts.unread');
    Route::get('/contacts', [AdminContactController::class, 'index'])->name('contacts.index');
    Route::get('/contacts/{id}', [AdminContactController::class, 'show'])->name('contacts.show');
    Route::delete('/contacts/{id}', [AdminContactController::class, 'destroy'])->name('contacts.destroy');
    Route::post('/contacts/{id}/read', [AdminContactController::class, 'markAsRead'])->name('contacts.read');
});

// =========== ROUTES PELAYAN/STAF (HANYA STAF) ===========
Route::middleware(['auth', 'role:staf'])->prefix('pelayan')->name('pelayan.')->group(function () {
    Route::get('/dashboard', [PelayanDashboardController::class, 'index'])->name('dashboard');

    // Transaksi Sewa
    Route::get('/transaksi', [PelayanTransaksiController::class, 'index'])->name('transaksi.index');
    Route::get('/transaksi/create', [PelayanTransaksiController::class, 'create'])->name('transaksi.create');
    Route::post('/transaksi', [PelayanTransaksiController::class, 'store'])->name('transaksi.store');
    Route::get('/transaksi/{id}', [PelayanTransaksiController::class, 'show'])->name('transaksi.show');
    Route::put('/transaksi/{id}/ambil', [PelayanTransaksiController::class, 'ambilBarang'])->name('transaksi.ambil');
    Route::delete('/transaksi/{id}/batal', [PelayanTransaksiController::class, 'batal'])->name('transaksi.batal');

    // Pengembalian
    Route::get('/pengembalian', [PelayanPengembalianController::class, 'index'])->name('pengembalian');
    Route::get('/pengembalian/{id}', [PelayanPengembalianController::class, 'show'])->name('pengembalian.show');
    Route::post('/pengembalian/{id}/proses', [PelayanPengembalianController::class, 'proses'])->name('pengembalian.proses');
    Route::post('/pengembalian/{id}/semua', [PelayanPengembalianController::class, 'kembalikanSemua'])->name('pengembalian.semua');

    // Manajemen Pelanggan
    Route::get('/pelanggan', [PelayanPelangganController::class, 'index'])->name('pelanggan.index');
    Route::post('/pelanggan', [PelayanPelangganController::class, 'store'])->name('pelanggan.store');
    Route::get('/pelanggan/{id}', [PelayanPelangganController::class, 'show'])->name('pelanggan.show');
    Route::get('/pelanggan/search', [PelayanPelangganController::class, 'search'])->name('pelanggan.search');

    // Cek Stok Barang
    Route::get('/barang/cek-stok', [PelayanBarangController::class, 'cekStok'])->name('barang.cek-stok');
    Route::get('/barang/{id}', [PelayanBarangController::class, 'show'])->name('barang.show');
});

// Laporan (perbaiki duplikasi)
Route::get('/laporan', [AdminLaporanController::class, 'index'])->name('laporan.index');
Route::get('/laporan/transaksi', [AdminLaporanController::class, 'transaksi'])->name('laporan.transaksi');
Route::get('/laporan/barang', [AdminLaporanController::class, 'barang'])->name('laporan.barang');
Route::get('/laporan/export-barang', [AdminLaporanController::class, 'exportBarang'])->name('laporan.export-barang');

// =========== ROUTE KONTAK (KIRIM PESAN DARI HALAMAN KONTAK) ===========
Route::post('/contact/send', [ContactController::class, 'send'])->name('contact.send');
