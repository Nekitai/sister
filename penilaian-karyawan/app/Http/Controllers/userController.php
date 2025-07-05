<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class userController extends Controller
{
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'username' => 'required|string|max:255|unique:users,username', // Pastikan username unik
            'role' => 'required|string|in:admin,karyawan,hrd,spv', // Pastikan role valid
            'department_id' => 'nullable|exists:departments,id', // Pastikan department_id valid jika diisi
            'password' => 'required|string|min:8|confirmed',
        ]);
        if (!in_array($request->role, ['admin', 'hrd']) && !$request->department_id) {
            return response()->json([
                'message' => 'Role ' . $request->role . ' wajib memiliki department_id.'
            ], 422);
        }
        // Buat user baru
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'role' => $request->role,
            'department_id' => in_array($request->role, ['admin', 'hrd']) ? null : $request->department_id,
            'password' => Hash::make($request->password),
        ]);
        \Log::info('Data user:', $user->toArray());


        // Kembalikan response sukses
        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
            'role' => $request->role
        ], 201);
    }
        public function index(Request $request)
    {
        $user = auth()->user(); // user yang sedang login
    
        // Jika Supervisor → hanya lihat karyawan di divisinya
        if ($user->role === 'spv') {
            $users = User::with('department')
                         ->where('department_id', $user->department_id)
                         ->where('role', 'karyawan')
                         ->get();
        }
    
        // Jika HRD → lihat semua karyawan & supervisor dari semua divisi
        elseif ($user->role === 'hrd') {
            $users = User::with('department')
                         ->whereIn('role', ['karyawan', 'spv'])
                         ->get();
        }
    
        // Jika admin → lihat semua (boleh diatur ulang jika perlu)
        elseif ($user->role === 'admin') {
            $users = User::with('department')->get();
        }
    
        // Role lainnya tidak diizinkan
        else {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
    
        return response()->json([
            'users' => $users,
        ], 200);
    }
    public function delete($id)
    {
    // Cari user berdasarkan ID
        $user = User::find($id);

        // Jika user tidak ditemukan
        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        // Hapus user
        $user->delete();

        // Kembalikan response sukses
        return response()->json([
            'message' => 'User berhasil dihapus.',
        ], 200);
    }

}
