<?php

namespace App\Exceptions;

use App\Exceptions\ValidationException as ExceptionsValidationException;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Laravel\Passport\Exceptions\OAuthServerException;
use League\OAuth2\Server\Exception\OAuthServerException as ExceptionOAuthServerException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        ValidationException::class,
        OAuthServerException::class,
        ExceptionOAuthServerException::class,
        ForbiddenException::class,
        UnauthorizedException::class,
        ExceptionsValidationException::class
    ];


    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function report(Throwable $exception)
    {
        if ($this->shouldReport($exception)) {
            Bugsnag::notifyException($exception, function ($report) {
                $report->setMetaData([
                    'environment' => app()->environment(),
                ]);
            });
        }

        parent::report($exception);
    }
}
