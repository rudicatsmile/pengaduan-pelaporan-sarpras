<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use Inertia\Inertia;

class DashboardController extends Controller
{
    use \App\Traits\BuildingAccess;

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Report::query();

        if ($user->hasRole('petugas')) {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('assigned_to', $user->id);
            });
        } elseif ($user->hasAnyRole(['admin', 'super_admin', 'supervisor'])) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $query->where(function($q) use ($allowedBuildingIds) {
                    $q->whereHas('room.floor', function($q2) use ($allowedBuildingIds) {
                        $q2->whereIn('building_id', $allowedBuildingIds);
                    })->orWhereNull('room_id');
                });
            }
        } else {
            $query->where('user_id', $user->id);
        }

        $stats = [
            'total' => (clone $query)->count(),
            'menunggu' => (clone $query)->where('status', 'baru')->count(),
            'diverifikasi' => (clone $query)->where('status', 'diverifikasi')->count(),
            'didelegasikan' => (clone $query)->where('status', 'didelegasikan')->count(),
            'proses' => (clone $query)->where('status', 'dalam_proses')->count(),
            'selesai' => (clone $query)->where('status', 'selesai')->count(),
            'ditolak' => (clone $query)->where('status', 'ditolak')->count(),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats
        ]);
    }
}
