<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Response;

class ApiFormRequest extends FormRequest
{
    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function failedValidation(Validator $validator): ValidationException
    {
        throw new ValidationException($validator, $this->formatErrors($validator));
    }

    /**
     * Format the errors from the given Validator instance.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return \Illuminate\Http\JsonResponse
     */
    protected function formatErrors(Validator $validator): JsonResponse
    {
        return new JsonResponse(errorResponse(Response::HTTP_UNPROCESSABLE_ENTITY, 'Unprocessable Entity', $validator->getMessageBag()->toArray()), Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
