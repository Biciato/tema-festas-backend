<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function setClient(Request $request) {
        $clientTrimmed = str_replace(' ', '-', $request->client);
        try {
            session(['client' => $clientTrimmed]);
        } catch (Exception $e) {
            return $e;
        } finally {
            return $clientTrimmed;
        }
    }

    public function getClient() {
        return session('client') ? session('client') : 'error';
    }

    public function setProds(Request $request) {
        try {
            session(['prods' => json_encode($request->prods)]);
        } catch (Exception $e) {
            return $e;
        } finally {
            return session('prods');
        }
    }

    public function getProds() {
        $prods = session('prods') ? session('prods') : [];
        return $prods;
    }

    public function cleanSessionProdsAndClient(Request $request) {
        try {
            $request->session()->forget(['prods', 'client']);
        } catch (Exception $e) {
            return $e;
        } finally {
            return 'success';
        }
    }
}
