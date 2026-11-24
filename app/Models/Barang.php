<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Barang extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'slug',
        'kategori_id',
        'ukuran',
        'warna',
        'harga_sewa',
        'stok',
        'deskripsi',
        'gambar_utama',
        'gambar_position_x',
        'gambar_position_y',
        'gambar_lain',
        'status',
        'total_disewa'
    ];

    protected $casts = [
        'harga_sewa' => 'decimal:2',
        'stok' => 'integer',
        'total_disewa' => 'integer',
        'gambar_position_x' => 'integer',
        'gambar_position_y' => 'integer',
        'gambar_lain' => 'array'
    ];

    // Auto generate slug dan kode barang
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($barang) {
            $barang->slug = Str::slug($barang->nama_barang);
            if (!$barang->kode_barang) {
                $barang->kode_barang = 'BRG-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
            }
        });
    }

    // Relasi ke kategori
    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }

    // Relasi ke detail transaksi
    public function detailTransaksis()
    {
        return $this->hasMany(DetailTransaksi::class);
    }

    // Scope tersedia
    public function scopeTersedia($query)
    {
        return $query->where('status', 'tersedia');
    }

    // Scope disewa
    public function scopeDisewa($query)
    {
        return $query->where('status', 'disewa');
    }

    // Scope by kategori
    public function scopeByKategori($query, $kategoriId)
    {
        return $query->where('kategori_id', $kategoriId);
    }

    // Cek ketersediaan
    public function isTersedia()
    {
        return $this->status === 'tersedia' && $this->stok > 0;
    }
}
