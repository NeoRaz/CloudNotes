<?php

namespace App\Repositories\User;

use App\Entity\User\UserEntity;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class UserRepository
{
    public function __construct(
        private User $user,
    ) {
    }

    public function getUsers(Request $request)
    {
        $users = QueryBuilder::for(User::class, $request)
            ->allowedIncludes('userDetail', 'wallets')
            ->allowedFilters([
                'first_name',
                'last_name',
                'email',
            ])
            ->allowedSorts(['created_at'])
            ->with('wallets');

        return $users->paginate($request->get('limit', 10));
    }

    public function saveUser(UserEntity $user): User
    {
        $dataCompare = ['email' => $user->email];
        $dataInsert = [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $user->password,
            'email_verified_at' => Carbon::now(),
        ];
        return $this->user->query()->updateOrCreate($dataCompare, $dataInsert);
    }

    public function retrieveUser(int $userId): User
    {
        return $this->user->find($userId);
    }

    public function getUserByEmail(string $email): User
    {
        return User::whereEmail($email)->first();
    }
}
