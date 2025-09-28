<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ValidationException extends Exception
{
    public function __construct($message)
    {
        parent::__construct($message);
    }

    /**
     * Report the exception.
     *
     * @return bool|null
     */
    public function report()
    {
        return true;
    }

    /**
     * Render the exception into an HTTP response.
     *
     * @return \Illuminate\Http\Response
     */
    public function render()
    {
        return new JsonResponse(errorResponse(Response::HTTP_UNPROCESSABLE_ENTITY, $this->getMessage()), Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
