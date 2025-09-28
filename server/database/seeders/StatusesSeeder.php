<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Status;

class StatusesSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            ['name' => 'Pending'],
            ['name' => 'On Hold'],
            ['name' => 'In Progress'],
            ['name' => 'Done'],
        ];

        foreach ($statuses as $s) {
            Status::firstOrCreate(['name' => $s['name']], $s);
        }
    }
}
