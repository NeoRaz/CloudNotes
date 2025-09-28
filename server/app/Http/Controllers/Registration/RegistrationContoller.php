<?php

namespace App\Http\Controllers\Registration;

use App\Entity\User\UserRegistrationEntity;
use App\Exceptions\ValidationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Registration\AccountSetupRequest;
use App\Http\Requests\Registration\RegistrationRequest;
use App\Http\Requests\Registration\VerifyRegistrationRequest;
use App\Models\UserRegistration;
use App\Models\UserRegistrationToken;
use App\Services\Email\EmailService;
use App\Services\Registration\RegistrationService;

class RegistrationContoller extends Controller
{
    public function __construct(
        private RegistrationService $registrationService,
        private UserRegistrationToken $userRegistrationToken,
        private EmailService $emailService,
    ) {
    }

    public function accountSetup(AccountSetupRequest $request)
    {
        $firstName = $request->input('first_name');
        $lastName = $request->input('last_name');
        $email = $request->input('email');
        $password = $request->input('password');

        $registrationEntity = new UserRegistrationEntity($firstName, $lastName, $password, $email);

        $result = $this->registrationService->saveUser($registrationEntity);

        $registrationId = $result->id;
        $userRegistration = UserRegistration::find($registrationId);
        $code = $this->userRegistrationToken->generateCode($userRegistration->email);
        $userToken = $this->registrationService->createRegistrationToken($registrationId, $code);
        $this->emailService->sendOTP($userToken->code, $userRegistration->email, $userRegistration->name);
        return response(successResponse($result));
    }

    public function verifyRegistration(VerifyRegistrationRequest $request)
    {
        $registrationId = $request->input('registration_id');
        $code = $request->input('code');
        $registrationLatestToken = $this->registrationService->findLatestRegistrationToken($registrationId);

        if ($registrationLatestToken->isValid() && $registrationLatestToken->code === $code) {
            $result = $this->registrationService->createUserWithVerifiedToken($registrationId, $registrationLatestToken->id);
            return response(successResponse($result));
        }

        throw new ValidationException("invalid_registration_code");
    }


    public function retrieveRegistration(RegistrationRequest $request)
    {
        $registrationId = $request->input('registration_id');
        $result = $this->registrationService->retrieveRegistration($registrationId);
        return response(successResponse($result));
    }
}
