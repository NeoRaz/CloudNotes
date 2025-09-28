<?php

namespace App\Services\Registration;

use App\Entity\User\UserEntity;
use App\Entity\User\UserRegistrationEntity;
use App\Exceptions\GeneralException;
use App\Models\UserRegistration;
use App\Models\UserRegistrationToken;
use App\Repositories\Registration\RegistrationRepository;
use App\Repositories\User\UserRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RegistrationService
{
    public function __construct(
        private RegistrationRepository $registrationRepository,
        private UserRepository $userRepository,
    ) {
    }

    public function saveUser(UserRegistrationEntity $userRegistration): UserRegistration
    {
        DB::beginTransaction();
        try {
            $userRegistration =  $this->registrationRepository->saveUser($userRegistration);
            DB::commit();
            Log::info(request(), [
                'success' => true,
                'message' => 'User Registration Created',
                'action' => 'created',
                'user_registration_id' => $userRegistration->id,
                'user_registration_email' => $userRegistration->email,
            ]);
            return $userRegistration;
        } catch (Exception $e) {
            DB::rollback();
            Log::error(request(), [
                'success' => false,
                'message' => 'User Registration Creation Failed',
                'error_message' => $e->getMessage(),
                'action' => 'stopped',
                'user_registration_email' => $userRegistration->email,
            ]);
            throw new GeneralException("create_user_failure");
        }
    }


    public function createRegistrationToken(int $userRegistrationId, string $code): UserRegistrationToken
    {
        DB::beginTransaction();
        try {
            $token = $this->registrationRepository->createRegistrationToken($userRegistrationId, $code);
            DB::commit();
            Log::info(request(), [
                'success' => true,
                'message' => 'User Token Created',
                'action' => 'created',
                'user_registration_id' => $userRegistrationId,
            ]);
            return $token;
        } catch (Exception $e) {
            DB::rollback();
            Log::error(request(), [
                'success' => false,
                'message' => 'User Token Creation Failed',
                'error_message' => $e->getMessage(),
                'action' => 'stopped',
                'user_registration_id' => $userRegistrationId,
            ]);
            throw new GeneralException("create_user_token_failure");
        }
    }

    public function findLatestRegistrationToken(int $userRegistrationId): UserRegistrationToken
    {
        return $this->registrationRepository->findLatestRegistrationToken($userRegistrationId);
    }

    public function createUserWithVerifiedToken(int $registrationId, int $userTokenId): array
    {
        DB::beginTransaction();
        try {
            $this->registrationRepository->updateRegistrationTokenToUsed($userTokenId);
            $userRegistration = UserRegistration::find($registrationId);

            $userEntity = new UserEntity(
                $userRegistration->name,
                $userRegistration->password,
                $userRegistration->email,
                $userRegistration->first_name,
                $userRegistration->last_name,
            );

            $user = $this->userRepository->saveUser($userEntity);

            DB::commit();

            $result = [
                'user' => $user,
            ];

            Log::info(request(), [
                'success' => true,
                'message' => 'User Registration Completed and User Created',
                'action' => 'created',
                'user_registration_id' => $registrationId,
                'user_id' => $user->id,
            ]);
            return $result;
        } catch (Exception $e) {
            DB::rollback();
            Log::error(request(), [
                'success' => false,
                'message' => 'User Registration Imcomplete and User Creation Failed',
                'error_message' => $e->getMessage(),
                'action' => 'stopped',
                'user_registration_id' => $registrationId,
            ]);
            throw new GeneralException("user_creation_failure");
        }
    }

    public function retrieveRegistration(int $userRegistrationId): UserRegistration
    {
        return $this->registrationRepository->findRegistrationById($userRegistrationId);
    }
}
