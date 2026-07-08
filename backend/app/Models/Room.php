<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'floor_id', 'room_type', 'inspection_interval'];

    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }

    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, 'room_assignments');
    }

    public function inspections()
    {
        return $this->hasMany(AssetInspection::class);
    }

    public function latestInspection()
    {
        return $this->hasOne(AssetInspection::class)->latestOfMany();
    }
}
