<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:100',
            'email'   => 'required|email',
            'phone'   => 'required|string|max:20',
            'address' => 'required|string',
            'items'   => 'required|array|min:1',
            'items.*.name'  => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.qty'   => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Store in DB (using SQLite by default)
        $order = \App\Models\Order::create([
            'name'    => $request->name,
            'email'   => $request->email,
            'phone'   => $request->phone,
            'address' => $request->address,
            'items'   => json_encode($request->items),
            'total'   => collect($request->items)->sum(fn($i) => $i['price'] * $i['qty']),
            'status'  => 'pending',
        ]);

        return response()->json([
            'message'  => 'Order placed successfully!',
            'order_id' => $order->id,
        ], 201);
    }

    public function index()
    {
        return response()->json(\App\Models\Order::latest()->get());
    }
}
