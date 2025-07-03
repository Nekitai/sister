<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckDepartmentAssignment
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Lewatkan jika user belum login
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Jika bukan admin, wajib punya department_id
        if (!in_array($user->role, ['admin', 'hrd']) && !$user->department_id) {
            return response()->json([
                'message' => 'Akses ditolak: pengguna harus memiliki departemen.'
            ], 403);
        }

        return $next($request);
    }
}
