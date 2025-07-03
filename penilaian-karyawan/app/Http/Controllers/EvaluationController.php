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
            'employee_id' => 'required|exists:users,id', // Pastikan employee_id valid
            'discipline' => 'required|integer|min:0|max:100',
            'initiative' => 'required|integer|min:0|max:100',
            'responsibility' => 'required|integer|min:0|max:100',
            'teamwork' => 'required|integer|min:0|max:100',
            'field_score' => 'required|integer|min:0|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        $spv= auth()->user();

        $employee = User::find($request->employee_id)
            ->where('department_id', $spv->department_id)
            ->where('role', 'karyawan')
            ->first();
        if (!$employee) {
            return response()->json(['message' => 'Employee not found or does not belong to your department'], 404);
        }

        // hitung total score
        $final_score =
        $request->decipline * 0.3+
        $request->initiative * 0.2+
        $request->responsibility * 0.2+
        $request->teamwork * 0.15+
        $request->field_score * 0.15;

        $existingEvaluation = Evaluation::where('evaluator_id', $spv->id)
            ->where('employee_id', $request->employee_id)
            ->first();


        if ($existingEvaluation) {
            return response()->json(['message' => 'You have already evaluated this employee'], 422);
        }

        $evaluation = Evaluation::create([
            'evaluator_id' => $spv->id,
            'employee_id' => $request->employee_id,
            'discipline' => $request->discipline,
            'initiative' => $request->initiative,
            'responsibility' => $request->responsibility,
            'teamwork' => $request->teamwork,
            'field_score' => $request->field_score,
            'final_score' => round($final_score, 2),
            'notes' => $request->notes,
]);



        // Kembalikan response sukses
        return response()->json(['message' => 'Evaluation saved successfully',
            'data' => $evaluation],
        201);
    }
}
