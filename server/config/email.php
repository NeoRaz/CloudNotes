<?php

return [
    'from-email' => env('MAIL_FROM_ADDRESS', 'isupport@razedify.com'),
    'from-name' => env('MAIL_FROM_NAME', 'RazEdify'),
    'view' => [
        'otp' => 'email.otp',
        'reset-password' => 'email.reset-password',

    ],
    'subject' => [
        'otp' => 'OTP',
        'reset-password' => 'Reset Password',
    ],

    'env' => env('APP_URL'),
    'reset-password-url' => env('RESET_PASSWORD_URL'),
];
