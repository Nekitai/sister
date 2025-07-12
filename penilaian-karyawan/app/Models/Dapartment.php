<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Dapartment extends Model
{
    use HasFactory;


    protected $table = 'departments';

    protected $fillable = ['name'];

    // Define any relationships if necessary
    // For example, if you have a User model that belongs to a department:
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function employees()
    {
        return $this->hasMany(User::class, 'department_id');
    }
}
