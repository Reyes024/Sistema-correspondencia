<?php

namespace App\Http\Controllers;

use App\Models\Correspondencia;

class DashboardController extends Controller
{
    // HU-007: Ver dashboard básico
    public function index()
    {
        $total = Correspondencia::count();
        $registrado = Correspondencia::where('estado', 'REGISTRADO')->count();
        $distribuido = Correspondencia::where('estado', 'DISTRIBUIDO')->count();
        $urgentes = Correspondencia::where('tipo', 'URGENTE')->count();

        return response()->json([
            'total_correspondencia' => $total,
            'documentos_registrado' => $registrado,
            'documentos_distribuido' => $distribuido,
            'documentos_urgentes' => $urgentes,
            'grafico_por_estado' => [
                ['estado' => 'REGISTRADO', 'cantidad' => $registrado],
                ['estado' => 'DISTRIBUIDO', 'cantidad' => $distribuido],
            ],
        ]);
    }
}
