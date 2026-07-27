<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('correspondencias', function (Blueprint $table) {
            $table->id();
            $table->string('folio')->unique();

            // Datos del remitente
            $table->string('remitente_nombre');
            $table->string('remitente_institucion')->nullable();

            // Datos del destinatario
            $table->foreignId('area_id')->constrained('areas');
            $table->string('destinatario_nombre');

            // Datos del documento
            $table->string('asunto');
            $table->integer('numero_fojas')->nullable();
            $table->enum('tipo', ['URGENTE', 'ORDINARIO'])->default('ORDINARIO');

            // Estado y fechas
            $table->enum('estado', ['REGISTRADO', 'DISTRIBUIDO'])->default('REGISTRADO');
            $table->timestamp('fecha_recepcion')->useCurrent();
            $table->timestamp('fecha_distribucion')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('correspondencias');
    }
};