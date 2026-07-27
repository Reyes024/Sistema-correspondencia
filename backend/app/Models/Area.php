<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'encargado',
    ];

    public function correspondencias()
    {
        return $this->hasMany(Correspondencia::class);
    }
}