<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'floor_id'];

    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }
}
