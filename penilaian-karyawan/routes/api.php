<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ReportController;

// ---------- PUBLIC ROUTES ----------
Route::post('/login', [AuthController::class, 'login']);

// ---------- AUTHENTICATED ROUTES ----------
Route::middleware('auth:api')->group(function () {

    // ----------- AUTH -----------
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', fn() => response()->json(auth()->user()));

    // ----------- USER MANAGEMENT -----------
    Route::get('/users', [UserController::class, 'index']);            // list users by role
    Route::post('/create-user', [UserController::class, 'store']);     // create user
    Route::delete('/users/{id}', [UserController::class, 'delete']);   // delete user
    Route::put('/users/{id}', [UserController::class, 'update']);      // update user (if needed)

    // ---------- PROFILE MANAGEMENT ----------
    Route::put('/profile/update', [UserController::class, 'updateProfile']);
    Route::put('/profile/password', [UserController::class, 'updatePassword']);
    Route::get('/profile', fn() => response()->json(auth()->user()));

    // ----------- EVALUATION (WITH DEPARTMENT CHECK) -----------
    Route::middleware('check.departments')->post('/evaluations', [EvaluationController::class, 'store']);
    Route::get('/dashboard-summary', [EvaluationController::class, 'summary']);

    // ----------- DEPARTMENT -----------
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::post('/departments', [DepartmentController::class, 'store']);
    Route::put('/departments/{id}', [DepartmentController::class, 'update']);
    Route::delete('/departments/{id}', [DepartmentController::class, 'delete']);
    

    // ----------- OPTIONAL: ADMIN ONLY (IF YOU USE ROLE MIDDLEWARE) -----------
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
    });
    // ----------- REPORTS -----------
    Route::prefix('reports')->group(function () {
        Route::get('/performance', [ReportController::class, 'performanceReport']);
        Route::get('/distribution', [ReportController::class, 'scoreDistribution']);
        Route::get('/trend', [ReportController::class, 'departmentTrend']);
        Route::get('/summary', [ReportController::class, 'summary']);
    });
});
