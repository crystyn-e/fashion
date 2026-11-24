<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $table = 'contacts';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Accessor untuk frontend (biar konsisten dengan kode sebelumnya)
    public function getNamaLengkapAttribute()
    {
        return $this->name;
    }

    public function getNoTeleponAttribute()
    {
        return $this->phone;
    }

    public function getPesanAttribute()
    {
        return $this->message;
    }
}
