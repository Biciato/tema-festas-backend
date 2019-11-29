<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Pedido;

class PedidoController extends Controller
{
    public function createOrder(Request $request) {
        return auth()->user()->pedidos()->create([
            'cliente' => $request->client
        ]);
    }
}
