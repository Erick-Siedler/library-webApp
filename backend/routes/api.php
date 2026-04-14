<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\StoreController;

Route::post('/login', [AuthController::class, 'auth']);
Route::post('/register', [UserController::class, 'register']);

Route::middleware('auth:sanctum', 'role:client,staff,admin')->group(function () {
    Route::get('/user', [UserController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/store/create', [StoreController::class, 'create']);
    });

    Route::middleware('role:admin,staff')->group(function () {
        Route::post('/book/create', [BookController::class, 'create']);
        Route::post('/book/edit', [BookController::class, 'edit']);
        Route::post('/book/destroy', [BookController::class, 'destroy']);
    });

    Route::get('/book/{id}', [BookController::class, 'book']);
    Route::get('store/books', [StoreController::class, 'store']);
});
