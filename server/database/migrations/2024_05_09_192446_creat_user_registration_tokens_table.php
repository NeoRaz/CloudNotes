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
        if (!Schema::hasTable('user_registration_tokens')) {
            Schema::create('user_registration_tokens', function (Blueprint $table) {
                $table->id();
                $table->string('code', 6);
                $table->unsignedBigInteger('user_registration_id');
                $table->boolean('is_used')->default(false);
                $table->timestamps();

                $table->foreign('user_registration_id')->references('id')->on('user_registrations')->onUpdate('cascade')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_registration_tokens');
    }
};
