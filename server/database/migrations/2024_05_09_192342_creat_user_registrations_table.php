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
        if (!Schema::hasTable('user_registrations')) {
            Schema::create('user_registrations', function (Blueprint $table) {
                $table->id();
                $table->string('email')->index();
                $table->string('password');
                $table->string('first_name')->nullable()->index();
                $table->string('last_name')->nullable()->index();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_registrations');
    }
};
