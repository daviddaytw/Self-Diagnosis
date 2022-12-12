<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('fb_psid')->nullable();
            $table->string('line_uid')->nullable();
            $table->date('birthday')->nullable();
            $table->enum('sex', ['Male', 'Female', 'Other'])->nullable();
            $table->boolean('family_cancer')->nullable();
            $table->json('interest_disease')->default('[]');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
