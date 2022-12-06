<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::name('facebook.')->group(function () {
    Route::get('/facebook_webhook', [Controllers\FacebookController::class, 'verify'])->name('verify');
    Route::post('/facebook_webhook', [Controllers\FacebookController::class, 'process'])->name('process');
});
