<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $products = Product::all();

            return ProductResource::collection($products);
        } catch (\Throwable $th) {
            error_log('PRODUCT_CONTROLLER__INDEX: ' . $th->getMessage());
            return response()->json(['message' => 'Fetch products failed'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        try {
            $product = Product::create($request->validated());

            return new ProductResource($product);
        } catch (\Throwable $th) {
            error_log('PRODUCT_CONTROLLER__STORE: ' . $th->getMessage());
            return response()->json(['message' => 'Create product failed'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $product = Product::findOrFail($id);

            return new ProductResource($product);
        } catch (\Throwable $th) {
            error_log('PRODUCT_CONTROLLER__SHOW: ' . $th->getMessage());
            return response()->json(['message' => 'Fetch product failed'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, string $id)
    {
        try {
            $data    = $request->validated();
            $product = Product::findOrFail($id);
            $product->update($data);

            return new ProductResource($product);
        } catch (\Throwable $th) {
            error_log('PRODUCT_CONTROLLER__UPDATE: ' . $th->getMessage());
            return response()->json(['message' => 'Update product failed'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();

            return response()->json("", 204);
        } catch (\Throwable $th) {
            error_log('PRODUCT_CONTROLLER__DESTROY: ' . $th->getMessage());
            return response()->json(['message' => 'Delete product failed'], 500);
        }
    }
}
