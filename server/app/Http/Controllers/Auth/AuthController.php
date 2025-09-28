<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Response;
use Laravel\Passport\TokenRepository;
use App\Exceptions\ForbiddenException;
use App\Exceptions\UnauthorizedException;
use App\Http\Requests\OAuth2\LoginRequest;
use Psr\Http\Message\ServerRequestInterface;
use League\OAuth2\Server\AuthorizationServer;
use App\Http\Requests\OAuth2\RefreshTokenRequest;
use Laravel\Passport\Http\Controllers\AccessTokenController;

class AuthController extends AccessTokenController
{
    protected $userService;
    protected $userToken;

    public function __construct(
        AuthorizationServer $server,
        TokenRepository $tokens,
    ) {
        $this->server = $server;
        $this->tokens = $tokens;
    }

    public function token(LoginRequest $request)
    {
        $email = $request->input('username');
        $user = User::where('email', $email)->first();

        $serverRequest = app()->makeWith(ServerRequestInterface::class, $request->all());
        $response = $this->issueToken($serverRequest);

        if ($response->getStatusCode() == Response::HTTP_OK) {
            if (!$user->isVerified()) {
                throw new ForbiddenException("account_not_verified");
            }
        } else {
            throw new UnauthorizedException("unauthorized");
        }


        $responseData = json_decode($response->getContent(), true);

        $responseData['username'] = $user->name;

        return response($responseData);
    }

    public function refreshToken(RefreshTokenRequest $request)
    {
        $serverRequest = app()->makeWith(ServerRequestInterface::class, $request->all());
        $token = $this->issueToken($serverRequest);
        return $token;
    }
}
