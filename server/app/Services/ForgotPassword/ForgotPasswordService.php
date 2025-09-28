<?php

namespace App\Services\ForgotPassword;

use Exception;
use App\Exceptions\GeneralException;
use App\Services\Email\EmailService;
use Illuminate\Support\Facades\Password;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Log;

class ForgotPasswordService
{
    public function __construct(
        private EmailService $emailService,
        private UserRepository $userRepository,
    ) {
    }

    public function sendResetPasswordEmail(string $email): void
    {
        try {
            $user = $this->userRepository->getUserByEmail($email);
            $resetToken = Password::createToken($user);

            $this->emailService->sendResetPasswordEmail($user, $resetToken);
        } catch (Exception $e) {
            Log::error(request(), [
                'success' => false,
                'message' => 'Failed to send reset password email',
                'error_message' => $e->getMessage(),
                'action' => 'stopped',
            ]);

            throw new GeneralException('failed_to_send_reset_password_email');
        }
    }

    public function checkTokenValidity(string $email, string $token): bool
    {
        $user = $this->userRepository->getUserByEmail($email);

        return Password::broker()->tokenExists($user, $token);
    }
}
