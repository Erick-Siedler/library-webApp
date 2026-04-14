<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();

            $table->foreignId('store_id')
                ->constrained('stores')
                ->onDelete('cascade');

            $table->string('title');
            $table->string('author');
            $table->string('genre');
            $table->string('publisher');
            $table->integer('pub_year');
            $table->string('ISBN');
            $table->string('pdf_path')->nullable();
            $table->bigInteger('stock_quantity')->default(1);
            $table->boolean('available')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
