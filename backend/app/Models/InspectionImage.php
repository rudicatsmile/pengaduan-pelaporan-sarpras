<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InspectionImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'inspection_id',
        'image_path',
    ];

    public function inspection()
    {
        return $this->belongsTo(Inspection::class);
    }
}
