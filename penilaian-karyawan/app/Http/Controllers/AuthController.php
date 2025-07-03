<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
        'login' => 'required',
        'password' => 'required',
    ]);

    $login_type = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

    $user = User::where($login_type, $request->login)->first();

    if (!$user) {
        return response()->json(['message' => 'User tidak ditemukan'], 404);
    }

    if (!Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Password salah'], 401);
    }

    // Jika pakai JWT:
    $credentials = [
        $login_type => $request->login,
        'password' => $request->password,
    ];

    if (!$token = auth()->attempt($credentials)) {
        return response()->json(['message' => 'Token gagal dibuat'], 500);
    }

    return response()->json([
        'access_token' => $token,
        'user' => $user,
        'role' => $user->role
    ]);
}
    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Logout berhasil']);
    }
}
