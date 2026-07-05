<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetInspectionDetail extends Model
{
    protected $fillable = [
        'asset_inspection_id',
        'asset_id',
        'asset_name',
        'is_present',
        'condition',
        'notes'
    ];

    protected $casts = [
        'is_present' => 'boolean',
    ];

    public function inspection()
    {
        return $this->belongsTo(AssetInspection::class, 'asset_inspection_id');
    }
}
