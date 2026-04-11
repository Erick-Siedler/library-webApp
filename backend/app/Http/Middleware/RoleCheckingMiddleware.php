<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleCheckingMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = Auth::user();

        if(!$user){
            return response()->json([
                'message' => 'Unauthenticated'
            ]);
        }

        if(!in_array($user->role, $roles)){
            return response()->json([
                'message' => 'Forbidden'
            ]);
        }

        return $next($request);
    }
}
