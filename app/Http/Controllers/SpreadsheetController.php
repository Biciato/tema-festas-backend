<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Aigen\TemaFesta\GerenciadorPlanilha;
use App\Pedido;
use App\Mail\PedidoCriado;

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
            Mail::to('rafaelh_rosario@hotmail.com')
                    ->send(new PedidoCriado(storage_path(
                        'app/pedidos-excel/'
                        .$client
                        . '/'
                        . $filename
                        .'.xls')));
            return 'success';
        }
    }
}
