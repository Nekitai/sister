<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\DepartmentController;
use Illuminate\Http\Request;
use App\Models\Dapartment;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);

// Routes with auth middleware
Route::middleware('auth:api')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', function () {
    \Log::info('Auth user', ['user' => auth()->user()]);
    return response()->json(auth()->user());
});

    // User Management
    Route::get('/create-user', [UserController::class, 'index']);
    Route::post('/create-user', [UserController::class, 'store']);
    Route::delete('/users/{id}', [UserController::class, 'delete']);

    // Evaluation (with department check)
    Route::middleware('check.departments')->post('/evaluations', [EvaluationController::class, 'store']);

    // Department routes
    Route::get('/departments', [DepartmentController::class, 'index']);

    Route::post('/departments', [DepartmentController::class, 'store']);

    // Admin only routes
    Route::middleware('auth:api')->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::get('/departments', [DepartmentController::class, 'index']);
        Route::post('/departments', [DepartmentController::class, 'store']);
    });
});


