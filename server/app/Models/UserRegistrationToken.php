<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class UserRegistrationToken extends Model
{
    const EXPIRATION_TIME = 900;
    const TEST_TOKEN = '227229';
    private const TEST_USER_PATTERN = '/demouser[\d,\w]*@book-chronicle\.com/';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_registration_tokens';

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [
        'id', 'created_at', 'updated_at',
    ];

    public function generateCode($email = null, $codeLength = 5)
    {
        // only allow test token in non-production environment
        if (
            config('app.env') !== 'production'
            && !is_null($email)
            && preg_match(static::TEST_USER_PATTERN, $email)
        ) {
            return static::TEST_TOKEN;
        }
        $min = pow(10, $codeLength);
        $max = $min * 10 - 1;
        $code = random_int($min, $max);

        return (string) $code;
    }

    public function isValid()
    {
        return !$this->is_used && !$this->isExpired();
    }

    public function isExpired()
    {
        return $this->created_at->diffInSeconds(Carbon::now()) > static::EXPIRATION_TIME;
    }
}
