<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;


class UserApiController extends Controller
{
    public function getUser(){
        return User::where('is_delete', 0)
        ->orderBy('created_at', 'desc')
        ->count();
    }

    public function getUserByMail(Request $request){  
        return User::where('email', $request->input('email'))->get();
    }

    public function getUserByPage(Request $request){
        $page = $request->input('page');
        $size = $request->input('size');
        return User::where('is_delete', 0)
        ->orderBy('created_at', 'desc')
        ->skip(($page-1)*$size)->take($size)
        ->get();
    }

    public function getUserSearchByPage(Request $request){
        $page = $request->input('page');
        $size = $request->input('size');
        if($request->input('status') == null){
            return User::where([
                ['is_delete', 0],
                ['name', 'like', '%' . $request->input('name') . '%'],
                ['email', 'like', '%' . $request->input('email') . '%'],
                ['group_role', 'like', '%' . $request->input('role') . '%'],
            ]) 
            ->orderBy('created_at', 'desc')
            ->skip(($page-1)*$size)->take($size)
            ->get();
        }else{
            return User::where([
                ['is_delete', 0],
                ['name', 'like', '%' . $request->input('name') . '%'],
                ['email', 'like', '%' . $request->input('email') . '%'],
                ['group_role', 'like', '%' . $request->input('role') . '%'],
                ['status', $request->boolean('status')],
            ]) 
            ->orderBy('created_at', 'desc')
            ->skip(($page-1)*$size)
            ->take($size)
            ->get();
        }
    }

    public function getAllUserSearch(Request $request){
        // $page = $request->input('page');
        // $size = $request->input('size');
        
        if($request->input('status') == null){
            return User::where([
                ['is_delete', 0],
                ['name', 'like', '%' . $request->input('name') . '%'],
                ['email', 'like', '%' . $request->input('email') . '%'],
                ['group_role', 'like', '%' . $request->input('role') . '%'],
            ]) ->orderBy('created_at', 'desc')->count();
        }else{
            return User::where([
                ['is_delete', 0],
                ['name', 'like', '%' . $request->input('name') . '%'],
                ['email', 'like', '%' . $request->input('email') . '%'],
                ['group_role', 'like', '%' . $request->input('role') . '%'],
                ['status', $request->boolean('status')],
            ]) ->orderBy('created_at', 'desc')->count();
        }
    }

    public function store(Request $request)
    {
        try {
            $data = [
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
                'group_role' => $request->input('role'),
                'status' => $request->boolean('status'),
                'is_delete' => false, 
            ];
            
            User::create($data);

            return response()->json([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
                'group_role' => $request->input('role'),
                'status' => $request->input('status'),
                'is_delete' => false, 
            ]);
        } catch (Exception $e) {
            return response()->json([
                'msg' => $e->getMessage(),
            ]);
        }
        return response()->json([
            'email' => $request->input('email'),      
        ]);
        // echo 123;
    }

    public function update(Request $request)
    {
        
        return DB::table('users')->where('id', $request->id)
            ->update([
                'name' => $request->name,
                'email' => $request->email,
                'status' => $request->boolean('status'),
                'group_role' => $request->role
            ]);
    }

    public function delete(Request $request)
    {
        
        return DB::table('users')->where('id', $request->id)
            ->update([
                'is_delete' => true,
            ]);
    }

    public function changestt(Request $request)
    {
        if($request->boolean('status') == true){
            return DB::table('users')->where('id', $request->id)
            ->update([
                'status' => false,
            ]);
        }else{
            return DB::table('users')->where('id', $request->id)
            ->update([
                'status' => true,
            ]);
        }

    }
}
