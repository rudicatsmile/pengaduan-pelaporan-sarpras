<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetSimbada extends Model
{
    protected $connection = 'simbada';
    protected $table = 'ta_kib_108';
    
    // As it's just for reading data from external DB, no fillable needed
    // You can specify the primary key if it's different from 'id'
    protected $primaryKey = 'IDT';
    public $timestamps = false;
}
