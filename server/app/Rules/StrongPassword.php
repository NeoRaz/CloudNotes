<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StrongPassword implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Check if the value is not empty
        if (empty($value)) {
            $fail('password_empty');
        }

        // Check if the value contains at least one uppercase letter
        if (!preg_match('/[A-Z]/', $value)) {
            $fail('password_missing_uppercase_letter');
        }

        // Check if the value contains at least one digit
        if (!preg_match('/\d/', $value)) {
            $fail('password_missing_digit');
        }

        // Check if the value contains at least one special character
        if (!preg_match('/[*.!@#$%^&(){}[\]:;<>,.?\/~_+\-=|]/', $value)) {
            $fail('password_missing_special_character');
        }

        // Check if the value has a total length of at least 8 characters
        if (strlen($value) < 8) {
            $fail('password_too_short');
        }
    }
}
