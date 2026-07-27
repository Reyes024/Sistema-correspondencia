<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Correspondencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'folio',
        'remitente_nombre',
        'remitente_institucion',
        'area_id',
        'destinatario_nombre',
        'asunto',
        'numero_fojas',
        'tipo',
        'estado',
        'fecha_recepcion',
        'fecha_distribucion',
    ];

    protected $casts = [
        'fecha_recepcion' => 'datetime',
        'fecha_distribucion' => 'datetime',
    ];

    // Relación con Area
    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    // Genera el folio automático: INF-[AÑO]-[NÚMERO]
    public static function generarFolio(): string
    {
        $anio = date('Y');

        $ultimo = self::where('folio', 'like', "INF-{$anio}-%")
            ->orderByDesc('id')
            ->first();

        if ($ultimo) {
            $partes = explode('-', $ultimo->folio);
            $numero = (int) end($partes) + 1;
        } else {
            $numero = 1;
        }

        return sprintf('INF-%s-%04d', $anio, $numero);
    }
}
