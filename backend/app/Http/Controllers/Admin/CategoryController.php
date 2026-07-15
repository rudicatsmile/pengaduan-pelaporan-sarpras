<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        return Inertia::render('Admin/Category/Index', [
            'categories' => Category::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        $request->validate(['name' => 'required|string|max:255']);
        Category::create($request->all());
        return redirect()->back()->with('message', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, Category $category)
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        $request->validate(['name' => 'required|string|max:255']);
        $category->update($request->all());
        return redirect()->back()->with('message', 'Kategori berhasil diubah.');
    }

    public function destroy(Category $category)
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        $category->delete();
        return redirect()->back()->with('message', 'Kategori berhasil dihapus.');
    }
}
