<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Dapartment;

class InitialSeeder extends Seeder
{
    public function run()
    {
        // Buat beberapa departemen
        $departments = ['IT', 'HRD', 'Keuangan', 'Produksi'];
        foreach ($departments as $name) {
            Dapartment::firstOrCreate(['name' => $name]);
        }

        // Buat admin
        User::create([
            'name' => 'Admin Utama',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'department_id' => null,
        ]);
    }
}

