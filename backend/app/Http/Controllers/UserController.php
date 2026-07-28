<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // HU-011: Reportes de actividad de usuarios (incluye listado con filtros)
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('rol')) {
            $query->where('rol', $request->rol);
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        $usuarios = $query->orderByDesc('created_at')->paginate(20);

        return response()->json($usuarios);
    }

    // HU-011: Métricas de reporte
    public function reporte()
    {
        $activos = User::where('estado', 'ACTIVO')->count();
        $inactivos = User::where('estado', 'INACTIVO')->count();

        $porRol = User::selectRaw('rol, count(*) as total')
            ->groupBy('rol')
            ->get();

        return response()->json([
            'usuarios_activos' => $activos,
            'usuarios_inactivos' => $inactivos,
            'usuarios_por_rol' => $porRol,
        ]);
    }

    // HU-008: Alta de usuario
    public function store(Request $request)
    {
        if ($request->user()->rol !== 'Administrador') {
            return response()->json(['message' => 'No autorizado. Se requiere rol de Administrador'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'rol' => 'required|in:Operador de Correspondencia,Encargado de Área,Administrador',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $usuario = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => $request->rol,
        ]);

        return response()->json($usuario, 201);
    }

    // HU-009: Cambiar datos y contraseña del usuario autenticado
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password_actual' => 'required_with:password_nueva|string',
            'password_nueva' => 'sometimes|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->filled('password_nueva')) {
            if (! Hash::check($request->password_actual, $user->password)) {
                return response()->json(['message' => 'La contraseña actual es incorrecta'], 422);
            }
            $user->password = Hash::make($request->password_nueva);
        }

        if ($request->filled('name')) {
            $user->name = $request->name;
        }

        if ($request->filled('email')) {
            $user->email = $request->email;
        }

        $user->save();

        return response()->json(['message' => 'Datos actualizados correctamente', 'user' => $user]);
    }

    // HU-010: Dar de baja (desactivar) usuario
    public function destroy(Request $request, User $user)
    {
        if ($request->user()->rol !== 'Administrador') {
            return response()->json(['message' => 'No autorizado. Se requiere rol de Administrador'], 403);
        }

        $user->estado = 'INACTIVO';
        $user->save();

        return response()->json(['message' => 'Usuario dado de baja correctamente', 'user' => $user]);
    }
}