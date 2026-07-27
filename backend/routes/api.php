<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CorrespondenciaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas (requieren token de Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('correspondencias', CorrespondenciaController::class)->except(['update', 'destroy']);
    Route::post('/correspondencias/{correspondencia}/distribuir', [CorrespondenciaController::class, 'distribuir']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
});