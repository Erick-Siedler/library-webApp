<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Book;

class Store extends Model
{
    protected $fillable = [
        'admin_id', 'name', 'description'
    ];

    public function books(){
        return $this->hasMany(Book::class);
    }
}
