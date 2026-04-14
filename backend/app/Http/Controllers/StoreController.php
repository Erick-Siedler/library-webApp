<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{
    public function store()
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        $store = Store::where('admin_id', $user->id)
            ->with('books')
            ->first();

        if (! $store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        return response()->json([
            'store' => $store,
            'books' => $store->books,
        ]);
    }

    public function create(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|min:3',
            'description' => 'required|min:3',
        ]);

        $user = Auth::user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        $store = Store::create([
            'admin_id' => $user->id,
            'name' => $data['name'],
            'description' => $data['description'],
        ]);

        if (! $store) {
            return response()->json([
                'message' => 'Store creation failed',
            ], 500);
        }

        return response()->json([
            'message' => 'Store created successfully',
            'store' => $store,
        ]);
    }
}
