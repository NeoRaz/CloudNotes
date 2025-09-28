<?php

use App\Http\Controllers\User\UserController;

Route::prefix('user')->group(function () {
    Route::get('/details', [UserController::class, 'getUserDetails'])->name('user.details');
    Route::post('/edit-details', [UserController::class, 'editUserDetails'])->name('user.edit-details');
    Route::post('/reset-password', [UserController::class, 'resetPassword'])->name('user.reset-password');
});