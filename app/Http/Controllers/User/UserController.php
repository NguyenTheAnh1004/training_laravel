<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use PharIo\Manifest\Email;

class UserController extends Controller
{
    public function index(){
        $data = auth()->user();
        return view('user.layout.userlayout');
    }

    public function getUser(){
        return User::all();
    }

    public function store(Request $request){
        return auth()->user();
    }
}
