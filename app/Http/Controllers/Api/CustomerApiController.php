<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CustomerApiController extends Controller
{
    public function getCustomers(){
        return Customer::where('is_delete', 0)
        ->orderBy('created_at', 'desc')
        ->count();
    }

    public function getCustomersByPage(Request $request){
        $page = $request->input('page');
        $size = $request->input('size');
        return Customer::where('is_delete', 0)
        ->orderBy('created_at', 'desc')
        ->skip(($page-1)*$size)->take($size)
        ->get();
    }

    public function getCustomersSearchByPage(Request $request){
        $page = $request->input('page');
        $size = $request->input('size');
        if($request->input('status') == null){
            return Customer::where([
                ['is_delete', 0],
                ['name', 'like', '%' . $request->input('name') . '%'],
                ['email', 'like', '%' . $request->input('email') . '%'],
                ['address', 'like', '%' . $request->input('address') . '%'],
            ]) 
            ->orderBy('created_at', 'desc')
            ->skip(($page-1)*$size)->take($size)
            ->get();
        }else{
            return Customer::where([
                ['is_delete', 0],
                ['name', 'like', '%' . $request->input('name') . '%'],
                ['email', 'like', '%' . $request->input('email') . '%'],
                ['address', 'like', '%' . $request->input('address') . '%'],
                ['status', $request->boolean('status')],
            ]) 
            ->orderBy('created_at', 'desc')
            ->skip(($page-1)*$size)
            ->take($size)
            ->get();
        }
    }

    public function getAllCustomersSearch(Request $request){
        // $page = $request->input('page');
        // $size = $request->input('size');
        
        if($request->input('status') == null){
            return Customer::where([
                ['is_delete', 0],
                ['name', 'like', '%' . $request->input('name') . '%'],
                ['email', 'like', '%' . $request->input('email') . '%'],
                ['address', 'like', '%' . $request->input('address') . '%'],
            ]) 
            ->count();
        }else{
            return Customer::where([
                ['is_delete', 0],
                ['name', 'like', '%' . $request->input('name') . '%'],
                ['email', 'like', '%' . $request->input('email') . '%'],
                ['address', 'like', '%' . $request->input('address') . '%'],
                ['status', $request->boolean('status')],
            ]) 
            ->count();
        }
    }

    public function store(Request $request)
    {
        try {
            $data = [
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'address' => $request->input('address'),
                'status' => $request->boolean('status'),
                'is_delete' => false, 
            ];
            
            Customer::create($data);

            return response()->json([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'address' => $request->input('address'),
                'status' => $request->boolean('status'),
                'is_delete' => false, 
            ]);
        } catch (Exception $e) {
            return response()->json([
                'msg' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request)
    {     
        return DB::table('customers')->where('id', $request->id)
            ->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'status' => $request->boolean('status'),
            ]);
    }
}
