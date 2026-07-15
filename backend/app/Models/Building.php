<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Observers\BuildingObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([BuildingObserver::class])]
class Building extends Model
{
    protected $fillable = ['name'];

    public function floors()
    {
        return $this->hasMany(Floor::class);
    }
}
