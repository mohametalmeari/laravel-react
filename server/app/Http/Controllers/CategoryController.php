<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $categories = Category::all();

            return CategoryResource::collection($categories);
        } catch (\Throwable $th) {
            error_log('CATEGORY_CONTROLLER__INDEX: ' . $th->getMessage());
            return response()->json(['message' => 'Fetch categories failed'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        try {
            $category = Category::create($request->validated());

            return new CategoryResource($category);
        } catch (\Throwable $th) {
            error_log('CATEGORY_CONTROLLER__STORE: ' . $th->getMessage());
            return response()->json(['message' => 'Create category failed'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $category = Category::findOrFail($id);

            return new CategoryResource($category);
        } catch (\Throwable $th) {
            error_log('CATEGORY_CONTROLLER__SHOW: ' . $th->getMessage());
            return response()->json(['message' => 'Fetch category failed'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, string $id)
    {
        try {
            $data     = $request->validated();
            $category = Category::findOrFail($id);
            $category->update($data);

            return new CategoryResource($category);
        } catch (\Throwable $th) {
            error_log('CATEGORY_CONTROLLER__UPDATE: ' . $th->getMessage());
            return response()->json(['message' => 'Update category failed'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $category = Category::findOrFail($id);
            $category->delete();

            return response()->json("", 204);
        } catch (\Throwable $th) {
            error_log('CATEGORY_CONTROLLER__DESTROY: ' . $th->getMessage());
            return response()->json(['message' => 'Delete category failed'], 500);
        }
    }
}
