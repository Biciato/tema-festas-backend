<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Fornecedor extends Authenticatable
{
    protected $table = 'fornecedores';
    
    protected $guarded = ['cod_fornecedores'];

    protected $primaryKey = 'cod_fornecedores';

    

    protected $fillable = ['dsc_password'];

    protected $hidden = [
        'dsc_password', 'remember_token',
    ];

    public function getAuthPassword()    {
        return $this->dsc_password;
    }
}
