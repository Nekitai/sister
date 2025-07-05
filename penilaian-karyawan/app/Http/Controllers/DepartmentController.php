<?php

namespace App\Http\Controllers;

use App\Models\Dapartment;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Create a new department
        $department = Dapartment::create($request->all());

        // Return a response
        return response()->json([
            'message' => 'Department created successfully',
            'department' => $department
        ], 201);
    }
    public function index()
    {
        // Logic to retrieve and return all departments
        return response()->json([
            'departments' => Dapartment::select('id', 'name')->get()
        ])->setStatusCode(200);
    }

    public function delete($id)
{
    $department = Dapartment::find($id);

    if (!$department) {
        return response()->json(['message' => 'Department not found'], 404);
    }

    $department->delete();

    return response()->json(['message' => 'Department deleted successfully'], 200);
}

public function update(Request $request, $id)
{
    $department = Dapartment::find($id);

    if (!$department) {
        return response()->json(['message' => 'Department not found'], 404);
    }

    $department->update($request->all());

    return response()->json(['message' => 'Department updated successfully', 'department' => $department], 200);

}
}
