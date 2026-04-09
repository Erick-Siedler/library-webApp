<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    function auth(Request $request) {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6'
        ], [
            'required' => "The field :attribute is mandatory",
            'email' => "Invalid email",
            'min' => "The password field must be at least 6 characters"
        ]);

        if (!Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password']
        ])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'login attempt successful'
        ]);
    }

    function logout(Request $request) {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'logout successful'
        ]);
    }
}
