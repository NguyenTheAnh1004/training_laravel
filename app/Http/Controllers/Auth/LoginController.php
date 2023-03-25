<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\AuthLoginRequest;
use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function index()
    {
        return view('auth.page.login');
    }

    public function login(AuthLoginRequest $rq)
    {
        // if (auth()->user()) {
        //     redirect()->route('auth.login');
        // }
        try {
            $data =  [
                'email' => $rq->input('email'),
                'password' => $rq->input('password')
            ];
            if (Auth::attempt($data, $rq->has('remember'))) {
                $user =  User::where('email', auth()->user()->email)->first();
                $user->last_iplogin = $rq->ip();
                // $user->last_login_at = now();
                $user->save();
                return redirect()->route('user');
            } else {
                echo 'sai roi';
                return back()->with('status', 'tài khoản hoặc mặc khẩu không chính xác');
            }
        } catch (Exception $e) {
            // Session::flash('error', $e->getMessage());
            return redirect()->back();
        }
    }
    
    public function store(Request $request)
    {
        try {
            $data = [
                'email' => $request->input('email'),
                // 'password' => Hash::make($request->input('password')),
            ];
            //create User::create($data);

            return response()->json([
                'email' => $request->input('email'),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'msg' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request,$id){
         //$user = user::find($id)
         //if($user) $user->update(data), $user->delete($id);
         
    }
}
