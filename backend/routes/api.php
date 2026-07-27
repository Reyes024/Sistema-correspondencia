<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CorrespondenciaController;

Route::apiResource('correspondencias', CorrespondenciaController::class)->except(['update', 'destroy']);
Route::post('/correspondencias/{correspondencia}/distribuir', [CorrespondenciaController::class, 'distribuir']);