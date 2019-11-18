@extends('layouts.app')

<style>
.login-btn {
    font-style: normal ;
    font-weight: bold ;
    font-size: 20px ;
    line-height: 27px ;
    text-align: center;
    background-color: #32338D;
    color: white;
    border: none;
    width: 100%;
    padding: 0.5em;
    margin-top: 1em ;
    -webkit-border-radius: 5px ;
    -moz-border-radius: 5px ;
    border-radius: 5px;
}
</style>


@section('content')
<div class="container">
    <div class="row justify-content-center text-center h-100" style="background-color: #32A1DD">
        <div class="col-md-6 justify-content-center text-center">
            <img src="/images/logo.png" alt="logo" style="width: 40%; margin: 2em auto;"></img>
            <h5 class="text-light">
                <img src="/images/user.svg" 
                    alt="user"
                    style="width: 5%; margin: 0.2em;">                            
                </img>
                Login
            </h5>
            <form method="POST" action="{{ route('login') }}">
                @csrf

                <div class="form-group row justify-content-center text-center">
                    <div class="col-md-6">
                        <input id="email" 
                                type="email" 
                                class="form-control @error('email') is-invalid @enderror" 
                                name="email" 
                                value="{{ old('email') }}" 
                                required 
                                placeholder="Usuário"
                                autocomplete="email" 
                                autofocus>

                        @error('email')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>
                </div>

                <div class="form-group row justify-content-center text-center">
                    <div class="col-md-6">
                        <input id="password" 
                                type="password" 
                                class="form-control @error('password') is-invalid @enderror" 
                                name="password" 
                                placeholder="Senha"
                                required 
                                autocomplete="current-password">

                        @error('password')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>
                </div>
                <div class="form-group row mb-0 justify-content-center text-center">
                    <div class="col-md-6">
                        <button type="submit" class="login-btn">
                            Entrar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
