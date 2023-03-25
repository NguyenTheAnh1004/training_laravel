<?php

use App\Http\Controllers\Api\CustomerApiController;
use App\Http\Controllers\Api\ProductApiController;
use App\Http\Controllers\Api\UserApiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\User\UserController;


Route::get('/test', function(){
    echo 123;
});

Route::get('users',[UserController::class, 'getUser']);
Route::put('user/{id}/update',[UserController::class, 'getUser']);
Route::post('/user/create', [UserController::class, 'store']);


Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::get('/logout', [LogoutController::class, 'logout'])->name('logout');

Route::get('/user', [UserController::class, 'index'])->name('user')->middleware('auth');
Route::get('/', [UserController::class, 'index'])->name('user')->middleware('auth');

Route::get('/api/users',[UserApiController::class, 'getUser']);
Route::post('/api/user/create',[UserApiController::class, 'store']);
Route::post('/api/user/update',[UserApiController::class, 'update']);
Route::post('/api/user/delete',[UserApiController::class, 'delete']);
Route::post('/api/user/changestt',[UserApiController::class, 'changestt']);
Route::get('/api/getuserbymail',[UserApiController::class, 'getuserbymail']);
Route::get('/api/getUserByPage',[UserApiController::class, 'getUserByPage']);
Route::get('/api/getUserSearchByPage',[UserApiController::class, 'getUserSearchByPage']);
Route::get('/api/getAllUserSearch',[UserApiController::class, 'getAllUserSearch']);


Route::get('/product', [ProductController::class, 'index'])->name('product')->middleware('auth');

Route::get('/api/products',[ProductApiController::class, 'getProducts']);
Route::post('/api/product/create',[ProductApiController::class, 'store']);
Route::post('/api/product/update',[ProductApiController::class, 'update']);
Route::post('/api/product/delete',[ProductApiController::class, 'delete']);
Route::get('/api/product/getProductByPage',[ProductApiController::class, 'getProductByPage']);
Route::get('/api/product/getUserSearchByPage',[ProductApiController::class, 'getUserSearchByPage']);
Route::get('/api/product/getAllUserSearch',[ProductApiController::class, 'getAllUserSearch']);

Route::get('/customer', [CustomerController::class, 'index'])->name('customer')->middleware('auth');

Route::get('/api/customers',[CustomerApiController::class, 'getCustomers']);
Route::post('/api/customers/create',[CustomerApiController::class, 'store']);
Route::post('/api/customers/update',[CustomerApiController::class, 'update']);
Route::get('/api/getCustomersByPage',[CustomerApiController::class, 'getCustomersByPage']);
Route::get('/api/getCustomersSearchByPage',[CustomerApiController::class, 'getCustomersSearchByPage']);
Route::get('/api/getAllCustomersSearch',[CustomerApiController::class, 'getAllCustomersSearch']);






