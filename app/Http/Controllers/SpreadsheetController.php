<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Aigen\TemaFesta\GerenciadorPlanilha;

class SpreadsheetController extends Controller
{
    public function getOrder(Request $request) {
        try {
            $client = str_replace(' ', '_', $request->client);
            $username = str_replace(' ', '_', auth()->user()->name);
            $date = str_replace(' ', '_', now()); 
            $date = str_replace(':', '_', $date);
            $filename = $username . '-' . $date;

            if (!is_dir(storage_path(
                            'app/pedidos-json/'. $client))) {
                mkdir(storage_path(
                        'app/pedidos-json/' . $client));
            }
            file_put_contents(
                storage_path(
                    'app/pedidos-json/' 
                    .$client
                    . '/' 
                    . $filename
                    .'.json'),
                json_encode($request->order)
            );
            if (!is_dir(storage_path(
                        'app/pedidos-excel/'. $client))) {
                mkdir(storage_path(
                        'app/pedidos-excel/' . $client), 0777, true);
            }
            $planilha = new GerenciadorPlanilha(
                storage_path(
                    'app/pedidos-excel/' 
                    .$client
                    . '/' 
                    . $filename
                    .'.xls')
            );
            $planilha->inserirPedido($request->order);
        } catch(Exception $e) {
            return $e;
        } finally {
            return 'success';
        }
    }
}
