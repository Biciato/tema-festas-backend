@component('mail::message')
Um Pedido foi criado pelo sistema Tema Festas com os seguintes dados:
<br>
Cliente: {{ $client }}<br>
Fornecedor: {{ $user }}<br>
Número do Pedido: {{ $order }}
<br><br><br>
Segue em anexo, o pedido no formato excel.

Atenciosamente, <br>
Tema Festas<br>
<a href="pedidos.temafestas.com.br">pedidos.temafestas.com.br</a>
@endcomponent
