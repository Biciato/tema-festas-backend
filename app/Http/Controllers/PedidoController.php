<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Pedido;

class PedidoController extends Controller
{
    public function createOrder(Request $request) {
        return ['data' => ['id' => 10]];
    }
}
