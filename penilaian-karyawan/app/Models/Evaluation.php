<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $fillable = [
        'employee_id',
        'evaluator_id',
        'discipline',
        'initiative',
        'responsibility',
        'teamwork',
        'field_score',
        'final_score',
        'notes', // Tambahkan kolom notes
    ];

    // Definisikan relasi dengan User jika diperlukan
    public function employee()
    {
        return $this->belongsTo(User::class , 'employee_id');
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }
}
