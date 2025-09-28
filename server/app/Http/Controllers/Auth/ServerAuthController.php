<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\OAuth2\ClientRequest;
use Illuminate\Http\Request;
use Laravel\Passport\Http\Controllers\AccessTokenController;
use Psr\Http\Message\ServerRequestInterface;

class ServerAuthController extends AccessTokenController
{
    public function token(ClientRequest $request)
    {
        $serverRequest = app()->makeWith(ServerRequestInterface::class, $request->all());
        $response = $this->issueToken($serverRequest);
        return $response;
    }
}
