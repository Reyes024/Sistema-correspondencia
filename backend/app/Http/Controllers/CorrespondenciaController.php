<?php

namespace App\Http\Controllers;

use App\Models\Correspondencia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CorrespondenciaController extends Controller
{
    // HU-002: Listar correspondencia con filtros
    public function index(Request $request)
    {
        $query = Correspondencia::with('area');

        // Filtro por folio o remitente
        if ($request->filled('buscar')) {
            $buscar = $request->buscar;
            $query->where(function ($q) use ($buscar) {
                $q->where('folio', 'like', "%{$buscar}%")
                  ->orWhere('remitente_nombre', 'like', "%{$buscar}%");
            });
        }

        // Filtro por estado
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        $correspondencias = $query->orderByDesc('created_at')->paginate(20);

        return response()->json($correspondencias);
    }

    // HU-001: Registrar correspondencia de entrada
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'remitente_nombre' => 'required|string|max:255',
            'remitente_institucion' => 'nullable|string|max:255',
            'area_id' => 'required|exists:areas,id',
            'destinatario_nombre' => 'required|string|max:255',
            'asunto' => 'required|string|max:255',
            'numero_fojas' => 'nullable|integer|min:0',
            'tipo' => 'required|in:URGENTE,ORDINARIO',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $correspondencia = Correspondencia::create([
            'folio' => Correspondencia::generarFolio(),
            'remitente_nombre' => $request->remitente_nombre,
            'remitente_institucion' => $request->remitente_institucion,
            'area_id' => $request->area_id,
            'destinatario_nombre' => $request->destinatario_nombre,
            'asunto' => $request->asunto,
            'numero_fojas' => $request->numero_fojas,
            'tipo' => $request->tipo,
            'estado' => 'REGISTRADO',
            'fecha_recepcion' => now(),
        ]);

        return response()->json($correspondencia->load('area'), 201);
    }

    // HU-004: Ver detalle de correspondencia
    public function show(Correspondencia $correspondencia)
    {
        return response()->json($correspondencia->load('area'));
    }

    // HU-003: Distribuir correspondencia
    public function distribuir(Request $request, Correspondencia $correspondencia)
    {
        if ($correspondencia->estado !== 'REGISTRADO') {
            return response()->json(['message' => 'Solo se puede distribuir correspondencia en estado REGISTRADO'], 422);
        }

        $correspondencia->update([
            'estado' => 'DISTRIBUIDO',
            'fecha_distribucion' => now(),
        ]);

        return response()->json($correspondencia->load('area'));
    }
}