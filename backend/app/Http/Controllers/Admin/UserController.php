<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        return Inertia::render('Admin/User/Index', [
            'users' => User::with(['roles', 'permissions'])->get(),
            'roles' => Role::all(),
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'roles' => 'required|array|min:1',
            'roles.*' => 'string|exists:roles,name',
            'receive_inspection_alerts' => 'nullable|boolean'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->roles);

        if ($request->receive_inspection_alerts && in_array('admin', $request->roles)) {
            Permission::firstOrCreate(['name' => 'receive-inspection-alerts', 'guard_name' => 'web']);
            $user->givePermissionTo('receive-inspection-alerts');
        }

        return redirect()->back()->with('message', 'User berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        
        if ($user->hasRole('super_admin') && !auth()->user()->hasRole('super_admin')) {
            return redirect()->back()->with('error', 'Anda tidak memiliki hak untuk mengubah Super Admin.');
        }
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'roles' => 'required|array|min:1',
            'roles.*' => 'string|exists:roles,name',
            'receive_inspection_alerts' => 'nullable|boolean'
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        $user->syncRoles($request->roles);

        if (in_array('admin', $request->roles)) {
            Permission::firstOrCreate(['name' => 'receive-inspection-alerts', 'guard_name' => 'web']);
            if ($request->receive_inspection_alerts) {
                if (!$user->hasPermissionTo('receive-inspection-alerts')) {
                    $user->givePermissionTo('receive-inspection-alerts');
                }
            } else {
                if ($user->hasPermissionTo('receive-inspection-alerts')) {
                    $user->revokePermissionTo('receive-inspection-alerts');
                }
            }
        } else {
            if ($user->hasPermissionTo('receive-inspection-alerts')) {
                $user->revokePermissionTo('receive-inspection-alerts');
            }
        }

        return redirect()->back()->with('message', 'User berhasil diubah.');
    }

    public function destroy(User $user)
    {
        if (!auth()->user()->hasRole('super_admin')) abort(403, 'Unauthorized');
        
        if ($user->hasRole('super_admin') && !auth()->user()->hasRole('super_admin')) {
            return redirect()->back()->with('error', 'Anda tidak memiliki hak untuk menghapus Super Admin.');
        }
        if ($user->hasRole('admin') && User::role('admin')->count() <= 1) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus admin terakhir.');
        }

        $hasReports = \App\Models\Report::where('user_id', $user->id)->exists();
        $hasAssignedReports = \App\Models\Report::where('assigned_to', $user->id)->exists();
        $hasInspections = \App\Models\Inspection::where('user_id', $user->id)->exists();
        
        if ($hasReports || $hasAssignedReports || $hasInspections) {
            return redirect()->back()->with('error', 'Gagal menghapus! User sudah pernah membuat pengaduan atau melakukan laporan kinerja.');
        }

        $user->delete();
        return redirect()->back()->with('message', 'User berhasil dihapus.');
    }
}
