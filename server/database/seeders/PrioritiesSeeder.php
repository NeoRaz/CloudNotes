<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Priority;

class PrioritiesSeeder extends Seeder
{
    public function run()
    {
        $priorities = [
            ['name' => 'Low'],
            ['name' => 'Medium'],
            ['name' => 'High'],
        ];

        foreach ($priorities as $p) {
            Priority::firstOrCreate(['name' => $p['name']], $p);
        }
    }
}
