<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos_aigen';
    
    protected $fillable = [
        'cliente', 'fornecedor', 'pedido', 'numero_pedido'
    ];

    public function generateUniqOrderNumber() {
        $number = mt_rand(100000, 999999); // better than rand()
    
        // call the same function if the order number exists already
        if ($this->orderNumberExists($number)) {
            return $this->generateUniqOrderNumber();
        }
    
        // otherwise, it's valid and can be used
        return $number;
    }
    
    protected function orderNumberExists($number) {
        // query the database for unique order number
        return $this->whereNumeroPedido($number)->exists();
    }
}
