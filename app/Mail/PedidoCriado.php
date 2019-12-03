<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class PedidoCriado extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    protected $path;
    public $client;
    public $user;
    public $order;

    public function __construct($path, $client, $user, $order)
    {
        $this->path = $path;
        $this->client = $client;
        $this->user = $user;
        $this->order = $order;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('pedidos@aigen.com.br')
                    ->markdown('emails.orders.shipped')
                    ->attach($this->path, ['mime' => 'application/excel']);
    }
}
