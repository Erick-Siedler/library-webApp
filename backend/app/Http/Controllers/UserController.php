<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    function register(Request $request){
        $credentials = $request->validate([
            'name' => 'required|min:2',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ], [
            'required' => "The field :attribute is mandatory",
            'email' => "Invalid email",
            'password:min' => "The password field must be at least 6 characters",
            'name:min' => "The name field must be at least 2 characters"
        ]);

        $user = User::create([
            'name' => $credentials['name'],
            'email' => $credentials['email'],
            'password' => Hash::make($credentials['password'])
        ]);

        if(!$user){
            return response()->json([
                'success' => false,
                'message' => 'register attempt failed'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'register attempt successful'
        ]);
    }

    function user(){
        return response()->json([
            'user' => Auth::user()
        ]);
    }
}
