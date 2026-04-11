<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Store;

class Book extends Model
{
    protected $fillable = [
        'store_id',
        'title',
        'author',
        'genre',
        'publisher',
        'pub_year',
        'ISBN',
        'stock_quantity',
        'available',
        'pdf_path',
    ];

    protected $casts = [
        'available' => 'boolean',
    ];

    public function store(){
        return $this->belongsTo(Store::class);
    }
}
