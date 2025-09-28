<?php

namespace App\Http\Controllers\Utility;

use Illuminate\Http\Request;
use  App\Models\Priority;
use App\Http\Controllers\Controller;

class priorityController extends Controller
{
    public function __construct(){}

    public function allPriorities()
    {
        $result = Priority::all();
        return response(successResponse($result));
    }
}
