<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;
use App\Fornecedor;

class CreateUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $pass = bcrypt('temafestas123');
        return collect(Fornecedor::all())->each(function($item) use($pass) {
            if (is_null(User::whereName($item->dsc_nome)->first())) {
                User::create([
                    'name' => $item->dsc_nome,
                    'email' => $item->dsc_nome,
                    'password' => bcrypt($pass)
                ]);
            }            
        });
    }
}
