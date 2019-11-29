<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFornecedoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('fornecedores')) {
            Schema::create('fornecedores', function (Blueprint $table) {
                $table->integer('cod_fornecedores');
                $table->string('dsc_nome');
                $table->string('dsc_email');
                $table->string('dsc_telefone');
                $table->string('dsc_telefone_adicional');
                $table->string('dsc_cpf');
                $table->string('dsc_rg');
                $table->string('dsc_complemento');
                $table->string('dsc_bairro');
                $table->string('dsc_cidade');
                $table->string('dsc_uf');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fornecedores');
    }
}
