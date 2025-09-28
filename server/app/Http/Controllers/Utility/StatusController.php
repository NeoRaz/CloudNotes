<?php

namespace App\Http\Controllers\Utility;

use Illuminate\Http\Request;
use  App\Models\Status;
use App\Http\Controllers\Controller;

class statusController extends Controller
{
    public function __construct(){}

    public function allStatuses()
    {
        $result = Status::all();
        return response(successResponse($result));
    }
}
