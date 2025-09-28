<?php

namespace App\Http\Controllers\ForgotPassword;

use App\Models\User;
use App\Exceptions\BadRequestException;
use Illuminate\Support\Facades\Password;
use App\Services\ForgotPassword\ForgotPasswordService;
use App\Http\Requests\ForgotPassword\ResetPasswordRequest;
use App\Http\Requests\ForgotPassword\CheckTokenValidityRequest;
use App\Http\Requests\ForgotPassword\SendResetPasswordEmailRequest;
use Illuminate\Support\Facades\Log;

class ForgotPasswordController
{
    protected $forgotPasswordService;

    public function __construct(
        ForgotPasswordService $forgotPasswordService
    ) {
        $this->forgotPasswordService = $forgotPasswordService;
    }

    public function sendResetPasswordEmail(SendResetPasswordEmailRequest $request)
    {
        $email = $request->input('email');
        $this->forgotPasswordService->sendResetPasswordEmail($email);

        return response(successResponse('email_successfully_sent'));
    }

    public function checkTokenValidity(CheckTokenValidityRequest $request)
    {
        $email = $request->input('email');
        $token = $request->input('token');

        $tokenExists = $this->forgotPasswordService->checkTokenValidity($email, $token);

        return response(successResponse($tokenExists));
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->password = $password;
                $user->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new BadRequestException('reset_password_failed');
        }

        return response(successResponse('reset_password_success'));
    }
}
