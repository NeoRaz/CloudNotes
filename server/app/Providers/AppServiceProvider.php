<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Passport::ignoreRoutes();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Passport::enablePasswordGrant();
        $this->loadMigrationsFrom(database_path('migrations/temps'));
        Request::macro('originIp', function () {
            return Request::header('cf-connecting-ip') ?? Request::getClientIp();
        });
    }
}
