<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inspection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InspectionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Inspection::with(['user', 'room'])->latest();

        if (!$user->hasAnyRole(['super_admin', 'admin', 'supervisor'])) {
            $query->where('user_id', $user->id);
        }

        return Inertia::render('Admin/Inspection/Index', [
            'inspections' => $query->get()
        ]);
    }

    public function show($id)
    {
        $inspection = Inspection::with(['user', 'room', 'images'])->findOrFail($id);
        
        $user = auth()->user();
        if ($inspection->user_id !== $user->id && !$user->hasAnyRole(['super_admin', 'admin', 'supervisor'])) {
            abort(403, 'Unauthorized');
        }

        if (!$inspection->is_read && $user->hasAnyRole(['super_admin', 'admin', 'supervisor'])) {
            $inspection->update(['is_read' => true]);
        }

        return Inertia::render('Admin/Inspection/Show', [
            'inspection' => $inspection
        ]);
    }

    public function updateNotes(Request $request, $id)
    {
        $request->validate([
            'notes' => 'nullable|string'
        ]);

        $inspection = Inspection::findOrFail($id);
        
        $user = auth()->user();
        if (!$user->hasAnyRole(['super_admin', 'admin'])) {
            abort(403, 'Unauthorized');
        }

        $inspection->update(['notes' => $request->notes]);

        return redirect()->back()->with('success', 'Catatan berhasil diperbarui.');
    }
}
