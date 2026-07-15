<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobCategoryController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        return Inertia::render('Admin/JobCategory/Index', [
            'jobCategories' => JobCategory::all()
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        $request->validate([
            'name' => 'required|string|max:255|unique:job_categories'
        ]);

        JobCategory::create([
            'name' => $request->name
        ]);

        return redirect()->back()->with('message', 'Kategori jabatan berhasil ditambahkan.');
    }

    public function update(Request $request, JobCategory $jobCategory)
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        $request->validate([
            'name' => 'required|string|max:255|unique:job_categories,name,' . $jobCategory->id
        ]);

        $jobCategory->update([
            'name' => $request->name
        ]);

        return redirect()->back()->with('message', 'Kategori jabatan berhasil diubah.');
    }

    public function destroy(JobCategory $jobCategory)
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        
        if ($jobCategory->users()->count() > 0) {
            return redirect()->back()->with('error', 'Kategori jabatan tidak dapat dihapus karena masih digunakan oleh user.');
        }

        $jobCategory->delete();
        return redirect()->back()->with('message', 'Kategori jabatan berhasil dihapus.');
    }
}
