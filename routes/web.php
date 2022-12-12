<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/setting', function () {
    $CANCERS = ['氣管、支氣管和肺癌', '女性乳癌', '肝和肝內膽管癌', '結腸、直腸和肛門癌', '口腔癌', '胰臟癌', '食道癌', '胃癌', '前列腺(攝護腺)癌', '卵巢癌'];

    return view('setting', [
        'CANCERS' => $CANCERS,
    ]);
});
