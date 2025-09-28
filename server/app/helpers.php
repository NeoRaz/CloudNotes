<?php

use App\Exceptions\GeneralException;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

function successResponse($data)
{
    return [
        'status_code' => Response::HTTP_OK,
        'success' => true,
        'data' => $data,
    ];
}

function errorResponse($code, $errorMsg = '', $data = [])
{
    return [
        'status_code' => $code,
        'success' => false,
        'data'  => $data,
        'error' => $errorMsg
    ];
}

function authorizedResponse($authorized)
{
    return [
        'status_code' => Response::HTTP_OK,
        'success' => true,
        'authorized' => $authorized,
    ];
}

function bytesToHuman(int $bytes): string
{
    $units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

    for ($i = 0; $bytes > 1024; $i++) {
        $bytes /= 1024;
    }

    return round($bytes, 2) . ' ' . $units[$i];
}

function handleError(\Exception $e, $customErrorMessage = '')
{
    if ($e instanceof ClientException && $e->getResponse()->getStatusCode() == 422) {
        return response()->json($e->getResponse()->getBody()->getContents(), 422);
    }
    throw new GeneralException($customErrorMessage);
}

function formatCurrency($amount)
{
    return number_format($amount, 2, '.', ',');
}
