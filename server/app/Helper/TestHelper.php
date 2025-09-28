<?php

namespace App\Helper;

use App\Models\Role;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\UserRole;
use App\Models\StudentTeacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestHelper
{
    public static function createUser(string $role)
    {
        $user = User::create([
            'name' => fake()->name,
            'email' => fake()->email,
            'password' => Hash::make('Testing123'),
        ]);

        if ($role == 'student') {
            UserRole::create([
                'user_id' => $user->id,
                'role_id' => Role::STUDENT,
            ]);
        } else if ($role == 'admin') {
            UserRole::create([
                'user_id' => $user->id,
                'role_id' => Role::ADMIN,
            ]);
        } else {
            UserRole::create([
                'user_id' => $user->id,
                'role_id' => Role::TEACHER,
            ]);
        }

        return $user;
    }

    public static function createTeacher()
    {
        $user = self::createUser('teacher');

        return Teacher::create([
            'user_id' => $user->id,
        ]);
    }

    public static function createStudent()
    {
        $user = self::createUser('student');

        return Student::create([
            'user_id' => $user->id,
            'is_active' => true,
        ]);
    }

    public static function createStudentTeacher(?int $studentId = null, ?int $teacherId = null)
    {
        DB::beginTransaction();
        try {
            if (is_null($studentId)) {
                $studentId = self::createStudent()->id;
            }

            if (is_null($teacherId)) {
                $teacherId = self::createTeacher()->id;
            }

            $studentTeacher = StudentTeacher::create([
                'student_id' => $studentId,
                'teacher_id' => $teacherId,
            ]);
            DB::commit();
            return $studentTeacher;
        } catch (\Exception $e) {
            DB::rollback();
            var_dump($e->getMessage());
        }
    }
}