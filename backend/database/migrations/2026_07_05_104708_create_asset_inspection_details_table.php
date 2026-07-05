<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('asset_inspection_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_inspection_id')->constrained('asset_inspections')->onDelete('cascade');
            $table->string('asset_id'); // IDT from simbada
            $table->string('asset_name');
            $table->boolean('is_present')->default(true);
            $table->enum('condition', ['baik', 'rusak'])->default('baik');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_inspection_details');
    }
};
