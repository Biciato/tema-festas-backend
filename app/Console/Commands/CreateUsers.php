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
        return collect(User::all())->each(function($item) use($pass) {
            $item->password = $pass;
            $item->save();   
        });
    }
}
