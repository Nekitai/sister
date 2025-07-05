<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Evaluation;

class EvaluationController extends Controller
{
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'employee_id' => 'required|exists:users,id',
            'discipline' => 'required|integer|min:0|max:100',
            'initiative' => 'required|integer|min:0|max:100',
            'responsibility' => 'required|integer|min:0|max:100',
            'teamwork' => 'required|integer|min:0|max:100',
            'field_score' => 'required|integer|min:0|max:100',
            'month' => 'required|date_format:Y-m',
            'notes' => 'nullable|string|max:500',
        ]);

        $evaluator = auth()->user();
        $employee = User::find($request->employee_id);

        // Validasi role yang bisa dinilai
        if (!in_array($employee->role, ['karyawan', 'spv'])) {
            return response()->json(['message' => 'Role tidak valid untuk dinilai'], 422);
        }

        // Jika evaluator SPV, hanya boleh nilai karyawan 1 departemen
        if ($evaluator->role === 'spv') {
            if (
                $employee->department_id !== $evaluator->department_id ||
                $employee->role !== 'karyawan'
            ) {
                return response()->json(['message' => 'SPV hanya dapat menilai karyawan dari departemen yang sama'], 403);
            }
        }

        // hitung total score
            $existingEvaluation = Evaluation::where('evaluator_id', $evaluator->id)
                ->where('employee_id', $request->employee_id)
                ->where('month', $request->month)
                ->first();

        if ($existingEvaluation) {
            return response()->json(['message' => 'Karyawan sudah dinilai bulan ini.'], 422);
        }


            $final_score =
            $request->discipline * 0.3 +
            $request->initiative * 0.2 +
            $request->responsibility * 0.2 +
            $request->teamwork * 0.15 +
            $request->field_score * 0.15;

        $evaluation = Evaluation::create([
            'evaluator_id' => $evaluator->id,
            'employee_id' => $request->employee_id,
            'discipline' => $request->discipline,
            'initiative' => $request->initiative,
            'responsibility' => $request->responsibility,
            'teamwork' => $request->teamwork,
            'field_score' => $request->field_score,
            'final_score' => round($final_score, 2),
            'month' => $request->month,
            'notes' => $request->notes,
        ]);



        // Kembalikan response sukses
        return response()->json(['message' => 'Evaluation saved successfully',
            'data' => $evaluation],
        201);
    }
}
