<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ProductApiController extends Controller
{
    public function getProducts(){
        return Product::where('is_delete', 0)
        ->orderBy('created_at', 'desc')
        ->count();
    }

    public function getProductByPage(Request $request){
        $page = $request->input('page');
        $size = $request->input('size');
        return Product::where('is_delete', 0)
        ->orderBy('created_at', 'desc')
        ->skip(($page-1)*$size)->take($size)
        ->get();
    }

    public function getUserSearchByPage(Request $request){
        $request->input('princeFrom') == null ?  $princeFrom = 0 :  $princeFrom = $request->input('princeFrom');
        $product = DB::table('products')->orderByDesc('prince')->first();
        $request->input('princeTo') == null ?  $princeTo = $product->prince :  $princeTo = $request->input('princeTo');
        $page = $request->input('page');
        $size = $request->input('size');
        return Product::where([
            ['is_delete', 0],
            ['name', 'like', '%' . $request->input('name') . '%'],
            ['active', 'like', '%' . $request->input('stt') . '%'],
        ]) 
            ->whereBetween('prince', [$princeFrom, $princeTo])
            ->orderBy('created_at', 'desc')
            ->skip(($page-1)*$size)->take($size)
            ->get();

    }

    public function getAllUserSearch(Request $request){
        $request->input('princeFrom') == null ?  $princeFrom = 0 :  $princeFrom = $request->input('princeFrom');
        $product = DB::table('products')->orderByDesc('prince')->first();
        $request->input('princeTo') == null ?  $princeTo = $product->prince :  $princeTo = $request->input('princeTo');
        $page = $request->input('page');
        $size = $request->input('size');
        return Product::where([
            ['is_delete', 0],
            ['name', 'like', '%' . $request->input('name') . '%'],
            ['active', 'like', '%' . $request->input('stt') . '%'],
        ]) 
            ->whereBetween('prince', [$princeFrom, $princeTo])
            ->count();
    }

    public function store(Request $request)
    {
        if($request->file('file')){
            $file = $request->file('file');
            $file_name = $file->getClientOriginalName();
            $file->move(public_path() . '/uploads/', $file_name);
        }
        else{
            $file_name = null;
        }

        $data = [
            'name' => $request->input('name'),
            'prince' => $request->input('prince'),
            'short_description' => $request->input('description'),
            'active' => $request->input('stt'),
            'image' => $file_name,
            'is_delete' => false, 
        ];

        Product::create($data);
        // return dd($request);
        return response()->json([
            'name' => $request->input('name'),
            'prince' => $request->input('prince'),
            'short_description' => $request->input('description'),
            'active' => $request->input('stt'),
            'image' => $file_name,
            'is_delete' => false, 
        ]);
    }

    public function update(Request $request)
    {
        if($request->file('file')){
            $file = $request->file('file');
            $file_name = $file->getClientOriginalName();
            $file->move(public_path() . '/uploads/', $file_name);
        }else{
            $file_name = $request->input('cur_img');
            $file_name= explode('/',$file_name);
            $file_name = end($file_name);
        }

        return DB::table('products')->where('id', $request->id)
        ->update([
            'name' => $request->input('name'),
            'prince' => $request->input('prince'),
            'short_description' => $request->input('description'),
            'active' => $request->input('stt'),
            'image' => $file_name,
            'is_delete' => false,
        ]);

        return response()->json([
            'name' => $request->input('name'),
            'prince' => $request->input('prince'),
            'short_description' => $request->input('description'),
            'active' => $request->input('stt'),
            'image' => $file_name,
            'is_delete' => false, 
        ]);
    }

    public function delete(Request $request)
    {
        
        return DB::table('products')->where('id', $request->id)
            ->update([
                'is_delete' => true,
            ]);
    }

}
