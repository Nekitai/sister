<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('evaluations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('employee_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('evaluator_id')->constrained('users')->onDelete('cascade');

        $table->tinyInteger('discipline');
        $table->tinyInteger('responsibility');
        $table->tinyInteger('initiative');
        $table->tinyInteger('teamwork');
        $table->tinyInteger('field_score');

        $table->float('final_score');
        $table->text('notes')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
