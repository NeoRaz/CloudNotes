<?php

namespace App\Services\Email;

use App\Mail\SendEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Jobs\EmailJob;
use App\Models\User;
use Illuminate\Support\Carbon;

class EmailService
{
    public function __construct()
    {
    }

    public function sendEmail(string $email, string $view, string $subject, array $details)
    {

        Mail::to(trim($email))->send(new SendEmail($view, $subject, $details));
        $timestamp = Carbon::now();
        Log::channel('email')->info("Email with subject of '" . $subject .  "' sent to '" . $email . "' at '" . $timestamp . "'");
    }


    public function sendToEmailQueue(string $email, string $view, string $subject, array $details)
    {
        $details = [
            'email' => trim($email),
            'view' => $view,
            'subject' => $subject,
            'details' =>  $details
        ];

        dispatch(new EmailJob($details));
        $timestamp = Carbon::now();
        Log::channel('email')->info("Email with subject of '" . $subject .  "' was sent to '" . $email . "' via email queue at '" . $timestamp . "'");
    }

    public function sendOTP(string $otpToken, string $email, string $name)
    {
        $subject = config('email.subject.otp');
        $view = config('email.view.otp');
        $details = [
            'name' => $name,
            'otp' => $otpToken,
        ];
        $this->sendToEmailQueue($email, $view, $subject, $details);

        return true;
    }

    public function sendResetPasswordEmail(User $user, string $token): bool
    {
        $email = $user->email;
        $subject = config('email.subject.reset-password');
        $view = config('email.view.reset-password');
        $details = [
            'name' => $user->name,
            'resetPassword' => config('email.reset-password-url') . '?token=' . urlencode($token) . '&email=' . urlencode($user->email)
        ];

        $this->sendEmail($email, $view, $subject, $details);
        return true;
    }
}
