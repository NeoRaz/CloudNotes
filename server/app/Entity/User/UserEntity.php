<?php

namespace App\Entity\User;

use DateTime;

class UserEntity
{
    public function __construct(
        public string $name,
        public string $password,
        public string $email,
        public string $firstName,
        public string $lastName,
    ) {
    }
}
