<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Aigen\TemaFesta\GerenciadorPlanilha;

class SpreadsheetController extends Controller
{
    public function getOrder(Request $request) {
        try {
            file_put_contents(
                storage_path('app/pedidos-json/' .$request->client. '/pedido.json'),
                json_encode($request->order)
            );
            $planilha = new GerenciadorPlanilha(
                storage_path('app/pedidos-excel/' .$request->client. 'pedido.xls')
            );
            $planilha->inserirPedido($request->order);
        } catch(Exception $e) {
            return $e;
        } finally {
            return 'success';
        }
    }
}
