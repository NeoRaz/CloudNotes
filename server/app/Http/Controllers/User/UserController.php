<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\User\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function getUserDetails(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'email'      => $user->email,
            ],
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'new_password' => 'required|min:8|confirmed', 
        ]);

        $user = $request->user();

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    public function editUserDetails(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'nullable|email|unique:users,email,' . $user->id,
        ]);

        $user->name  = $validated['first_name'] . ' ' . $validated['last_name'];

        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        $user->save();

        return response()->json([
            'message' => 'User details updated successfully',
            'user'    => $user,
        ]);
    }

}
