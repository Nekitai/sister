<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evaluation;
use App\Models\Dapartment;

class ReportController extends Controller
{
    public function summary(Request $request)
    {
        $month = $request->query('month');

        $query = Evaluation::query();
        if ($month) {
            $query->where('month', $month);
        }

        return response()->json([
            'totalEmployees' => $query->distinct('employee_id')->count('employee_id'),
            'averagePerformanceScore' => round($query->avg('final_score'), 1),
            'topPerformers' => $query->where('final_score', '>=', 90)->count(),
            'excellentRating' => $query->where('final_score', '>=', 90)->count(),
            'goodRating' => $query->whereBetween('final_score', [80, 89.99])->count(),
            'improvementNeeded' => $query->where('final_score', '<', 80)->count(),
        ]);
    }

    public function performanceReport(Request $request)
    {
        $month = $request->query('month');

        $query = Evaluation::with('employee.department');
        if ($month) {
            $query->where('month', $month);
        }

        $data = $query->get()->map(function ($e) {
            return [
                'name' => $e->employee->name,
                'department' => optional($e->employee->department)->name,
                'performanceScore' => $e->final_score,
                'productivity' => $e->field_score,
                'quality' => $e->responsibility,
                'teamwork' => $e->teamwork,
                'initiative' => $e->initiative,
                'communication' => $e->discipline,
                'overallRating' => $this->getRating($e->final_score),
                'goals' => $e->notes ?? '-',
            ];
        });

        return response()->json(['data' => $data]);
    }

    public function scoreDistribution(Request $request)
    {
        $month = $request->query('month');

        $query = Evaluation::query();
        if ($month) {
            $query->where('month', $month);
        }

        $distribution = [
            ['name' => 'Excellent', 'value' => $query->clone()->where('final_score', '>=', 90)->count(), 'color' => '#10B981'],
            ['name' => 'Very Good', 'value' => $query->clone()->whereBetween('final_score', [80, 89.99])->count(), 'color' => '#3B82F6'],
            ['name' => 'Good', 'value' => $query->clone()->whereBetween('final_score', [70, 79.99])->count(), 'color' => '#F59E0B'],
            ['name' => 'Satisfactory', 'value' => $query->clone()->whereBetween('final_score', [60, 69.99])->count(), 'color' => '#EF4444'],
            ['name' => 'Needs Improvement', 'value' => $query->clone()->where('final_score', '<', 60)->count(), 'color' => '#6B7280'],
        ];

        return response()->json(['data' => $distribution]);
    }

    public function departmentTrend(Request $request)
    {
        $month = $request->query('month');

        $departments = Dapartment::with(['employees.evaluations' => function ($q) use ($month) {
            if ($month) $q->where('month', $month);
        }])->get();

        $data = $departments->map(function ($dept) {
            $scores = collect();

            foreach ($dept->employees as $emp) {
                foreach ($emp->evaluations as $eval) {
                    $scores->push($eval);
                }
            }

            return [
                'name' => $dept->name,
                'employees' => $dept->employees->count(),
                'avgScore' => round($scores->avg('final_score'), 1),
                'productivity' => round($scores->avg('field_score'), 1),
                'quality' => round($scores->avg('responsibility'), 1),
                'teamwork' => round($scores->avg('teamwork'), 1),
                'initiative' => round($scores->avg('initiative'), 1),
                'communication' => round($scores->avg('discipline'), 1),
            ];
        });

        return response()->json([
            'departments' => $data,
            'trend' => $this->monthlyTrend(),
        ]);
    }

    private function monthlyTrend()
    {
        return Evaluation::selectRaw('month, AVG(final_score) as avgScore, SUM(CASE WHEN final_score >= 90 THEN 1 ELSE 0 END) as topPerformers')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();
    }

    private function getRating($score)
    {
        if ($score >= 90) return "Excellent";
        if ($score >= 80) return "Very Good";
        if ($score >= 70) return "Good";
        if ($score >= 60) return "Satisfactory";
        return "Needs Improvement";
    }
}
