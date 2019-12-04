<?php

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
    return redirect('/clientes');
});

// Base React Components
Route::middleware(['auth'])->group(function () {
    Route::view('/clientes', 'client');
    Route::view('/pedido/{client}', 'order');
    Route::view('/resumo', 'cart');

    // Order related Routes
    Route::post('/create-order', 'SpreadsheetController@createOrder');
});

// Auth Rotes
Auth::routes();

// Session related Routes
Route::post('/set-client', 'SessionController@setClient');
Route::get('/get-client', 'SessionController@getClient');

Route::post('/set-prods', 'SessionController@setProds');
Route::get('/get-prods', 'SessionController@getProds');

Route::get('/clean-session-client-prods', 'SessionController@cleanSessionProdsAndClient');


