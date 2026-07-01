<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class PetugasController extends Controller
{
    public function index()
    {
        // Get all users with role 'petugas'
        $petugas = User::role('petugas')->get(['id', 'name', 'email']);
        
        return response()->json([
            'message' => 'Berhasil mengambil daftar petugas',
            'data' => $petugas
        ]);
    }
}
