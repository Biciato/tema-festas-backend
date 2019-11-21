<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Aigen\TemaFesta\GerenciadorPlanilha;

class SpreadsheetController extends Controller
{
    public function getOrder(Request $request) {
        try {
            file_put_contents(
                storage_path('app/pedidos-json/pedido.json'),
                json_encode($request->order)
            );
            $planilha = new GerenciadorPlanilha(storage_path('app/pedidos-excel/pedido.xls'));
            $planilha->inserirPedido($request->order);
        } catch(Exception $e) {
            return $e;
        } finally {
            return 'success';
        }
    }
}
