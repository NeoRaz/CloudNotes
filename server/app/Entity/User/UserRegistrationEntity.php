<?php

namespace App\Entity\User;

class UserRegistrationEntity
{
    public function __construct(
        public string $firstName,
        public string $lastName,
        public string $password,
        public string $email,
    ) {
    }
}
