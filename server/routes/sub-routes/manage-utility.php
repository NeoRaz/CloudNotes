<?php

use App\Http\Controllers\Utility\PriorityController;
use App\Http\Controllers\Utility\StatusController;

Route::prefix('utility')->group(function () {
    Route::get('/all-priorities', [PriorityController::class, 'allPriorities'])->name('utility.all-priorities');
    Route::get('/all-statuses', [StatusController::class, 'allStatuses'])->name('utility.all-statuses');
});