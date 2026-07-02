<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inspection;
use App\Models\InspectionImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InspectionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Inspection::with(['user', 'room', 'images'])->latest();

        if ($user->hasAnyRole(['super_admin', 'admin', 'supervisor'])) {
            // Bisa melihat semuanya
        } else {
            // Hanya bisa melihat laporannya sendiri
            $query->where('user_id', $user->id);
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(10)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'description' => 'required|string',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120'
        ]);

        $inspection = Inspection::create([
            'user_id' => $request->user()->id,
            'room_id' => $request->room_id,
            'description' => $request->description,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('inspections', 'public');
                InspectionImage::create([
                    'inspection_id' => $inspection->id,
                    'image_path' => '/storage/' . $path,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Laporan inspeksi berhasil dibuat.',
            'data' => $inspection->load('images')
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $inspection = Inspection::with(['user', 'room', 'images'])->findOrFail($id);
        $user = $request->user();

        if ($inspection->user_id !== $user->id && !$user->hasAnyRole(['super_admin', 'admin', 'supervisor'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $inspection
        ]);
    }
}
