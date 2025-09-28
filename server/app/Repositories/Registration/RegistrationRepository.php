<?php

namespace App\Repositories\Registration;

use App\Models\UserRegistration;
use Illuminate\Support\Facades\Hash;
use App\Models\UserRegistrationToken;
use App\Entity\User\UserRegistrationEntity;

class RegistrationRepository
{
    public function __construct(
        private UserRegistration $userRegistration,
        private UserRegistrationToken $userRegistrationToken
    ) {
    }

    public function saveUser(UserRegistrationEntity $userRegistration): UserRegistration
    {
        $userRegistration =  $this->userRegistration::updateOrCreate(
            [
                'email' => $userRegistration->email
            ],
            [
                'first_name' => $userRegistration->firstName,
                'last_name' => $userRegistration->lastName,
                'password' => Hash::make($userRegistration->password),
            ]
        );

        return $userRegistration;
    }


    public function createRegistrationToken(int $userRegistrationId, string $code): UserRegistrationToken
    {
        $userToken = $this->userRegistrationToken->create([
            'code' => $code,
            'user_registration_id' => $userRegistrationId,
            'is_used' => false,
        ]);

        return $userToken;
    }

    public function findLatestRegistrationToken(int $userRegistrationId): UserRegistrationToken
    {
        $userToken = $this->userRegistrationToken->where('user_registration_id', $userRegistrationId)->latest()->first();
        return $userToken;
    }

    public function updateRegistrationTokenToUsed(int $userTokenId): bool
    {
        $userToken =  $this->userRegistrationToken->find($userTokenId)->update(['is_used' => true]);
        return $userToken;
    }

    public function findRegistrationById(int $registrationId): UserRegistration
    {
        return $this->userRegistration->query()->find($registrationId);
    }
}
