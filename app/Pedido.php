<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $fillable = [
        'user_id', 'cliente', 'total_pedido'
    ];

    public function user() {
        return $this->belongsTo('App\User');
    }
}
