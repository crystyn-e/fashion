<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('barangs', function (Blueprint $table) {
            $table->unsignedTinyInteger('gambar_position_x')->default(50);
            $table->unsignedTinyInteger('gambar_position_y')->default(50);
        });
    }

    public function down()
    {
        Schema::table('barangs', function (Blueprint $table) {
            $table->dropColumn(['gambar_position_x', 'gambar_position_y']);
        });
    }
};
