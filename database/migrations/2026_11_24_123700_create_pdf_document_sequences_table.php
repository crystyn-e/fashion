<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pdf_document_sequences', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->unsignedSmallInteger('last_number')->default(0);
        });

        DB::table('pdf_document_sequences')->insert([
            'key' => 'transaction_report',
            'last_number' => 0,
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('pdf_document_sequences');
    }
};
