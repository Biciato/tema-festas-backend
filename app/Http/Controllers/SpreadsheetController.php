<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Aigen\TemaFesta\GerenciadorPlanilha;
use App\Pedido;
use App\Mail\PedidoCriado;

class SpreadsheetController extends Controller
{
    public function createOrder(Request $request) {
        if (session('client') && $request->order) {
            // get Client from Session
            $client = session('client');
            // date with white space replaced by underscore
            $date = str_replace(' ', '_', now());
            // date with double dots replaced by underscore
            $date = str_replace(':', '_', $date);

            // Try to make dir if it doesnt exists
            try {
                if (!is_dir(storage_path('app/pedidos-json/'. $client))) {
                    mkdir(storage_path(
                            'app/pedidos-json/' . $client));
                }
            } catch (Exception $e) {
                return $e;
            }
            // Try to make dir if it doesnt exists
            try {
                if (!is_dir(storage_path('app/pedidos-excel/'. $client))) {
                    mkdir(storage_path(
                            'app/pedidos-excel/' . $client));
                }
            } catch (Exception $e) {
                return $e;
            }
            // Try to save file on the server
            try {
                file_put_contents(
                    storage_path(
                        'app/pedidos-json/'
                        .$client
                        . '/'
                        . $date
                        .'.json'),
                    json_encode($request->order)
                );
            } catch (Exception $e) {
                return $e;
            }

            // instancing Class with path to save file    
            $planilha = new GerenciadorPlanilha(
                storage_path(
                    'app/pedidos-excel/'
                    .$client
                    . '/'
                    . $date
                    .'.xls')
            );

            // Try to save file on the server
            try {
                $planilha->inserirPedido($request->order);
            } catch(Exception $e) {
                return $e;
            } 
            $pedido = new Pedido();
            $newPedido = $pedido->create([
                'cliente' => str_replace('-', ' ', session('client')),
                'fornecedor' => auth()->user()->name,
                'numero_pedido' => $pedido->generateUniqOrderNumber(),
                'pedido' => $date . '.json'
            ]);
            
            // Try to send E-mail
            try {
                if (config('app.env') !== 'local') {
                    Mail::to('rafael@aigen.com.br')
                            ->cc('mario@temafestas.com.br')
                            ->send(new PedidoCriado(storage_path(
                                'app/pedidos-excel/'
                                .$client
                                . '/'
                                . $date
                                .'.xls'),
                                session('client'),
                                $newPedido->fornecedor,
                                $newPedido->numero_pedido
                            ));
                }
            } catch (Exception $e) {
                return $e;
            }

            return $newPedido->numero_pedido;
        } else {
            return response('error', 500);
        }
    }
}
