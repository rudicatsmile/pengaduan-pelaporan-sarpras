<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetInspection extends Model
{
    protected $fillable = ['user_id', 'room_id', 'notes'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function details()
    {
        return $this->hasMany(AssetInspectionDetail::class);
    }
}
