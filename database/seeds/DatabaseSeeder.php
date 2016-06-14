<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      Model::unguard();

      DB::table('users')->delete();

      $users = array(
              ['name' => 'Guillaume L', 'email' => 'guillaume@vcp.com', 'password' => Hash::make('secretg')],
              ['name' => 'Charles N', 'email' => 'charles@vcp.com', 'password' => Hash::make('secretc')]
      );

      // Loop through each user above and create the record for them in the database
      foreach ($users as $user)
      {
          User::create($user);
      }

      Model::reguard();

    }
}
