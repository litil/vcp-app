<?php

namespace App\Http\Controllers;

// app/Http/controllers/AuthenticateController.php

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use GuzzleHttp;
use GuzzleHttp\Subscriber\Oauth\Oauth1;
use App\Http\Controllers\JWT;
use DateTime;


class AuthenticateController extends Controller
{

    public function __construct()
    {
       // Apply the jwt.auth middleware to all methods in this controller
       // except for the authenticate method. We don't want to prevent
       // the user from retrieving their token if they don't already have it
       $this->middleware('jwt.auth', ['except' => ['authenticate', 'register', 'facebook']]);
     }

    public function index()
    {
      // Retrieve all the users in the database and return them
      $users = User::all();
      return $users;
    }

    /**
     * This method tries to create a user corresponding to the email/password
     * given in the request.
     */
    public function register(Request $request) {
      $newuser = $request->all();
      $password = Hash::make($request->input('password'));

      $newuser['password'] = $password;

      return User::create($newuser);
    }

    /**
     * This method autenticates the user corresponding to the email given in
     * the request.
     */
    public function authenticate(Request $request) {
        $credentials = $request->only('email', 'password');
        try {
            // verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        Log::info('Authenticate success !!!');
        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
    }

    public function getAuthenticatedUser()
    {
        try {

            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }


        // the token is valid and we have found the user via the sub claim
        return response()->json(compact('user'));
    }


    /**
     * Login with Facebook. The algorithm is quite simple :
     * 1- Get the Facebook user with the iven access_token
     * 2- Authenticate the user with the Facebook id
     * 3- If no user was found with the Facebook id, authenticate him with the Facebook email address
     * 4- If no user was found with the Facebook email address, create a new user
     * 
     */
    public function facebook(Request $request)
    {
        $client = new GuzzleHttp\Client();

        // Step 1. Retrieve profile information about the current user.
        $fields = 'id,email,first_name,last_name,link,name';
        $profileResponse = $client->request('GET', 'https://graph.facebook.com/v2.5/me', [
            'query' => [
                'access_token' => $request->input('access_token'),
                'fields' => $fields
            ]
        ]);
        $profile = json_decode($profileResponse->getBody(), true);

        // Step 2. Try to authenticate user with Facebook id
        $user = User::where('facebook', '=', $profile['id']);
        if ($user->first()) {
            Log::info('AUTH - Facebook user retrieved from Facebook ID');
            return JWTAuth::fromUser($user->first());

        } else {
            // Step 3. Try to authenticate user with Facebook email address
            $users = User::where('email', '=', $profile['email']);

            if ($users->first()) {
                Log::info('AUTH - Facebook user retrieved from Facebook email address');
                $user = $users->first();
                $user->facebook = $profile['id'];
                $user->email = $user->email ?: $profile['email'];
                $user->displayName = $user->displayName ?: $profile['name'];
                $user->save();
                return JWTAuth::fromUser($user);

            } else {
                // Step 4. Create a new user and authenticate it
                Log::info('AUTH - No Facebook user retrieved, we create a new one');
                $now = new DateTime();
                $id = User::insertGetId(
                    [
                        'email' => $profile['email'],
                        'name' => $profile['name'],
                        'facebook' => $profile['id'],
                        'password' => Hash::make(str_random(8)),
                        'created_at' => $now,
                        'updated_at' => $now
                    ]
                );
                $newusers = User::where('id', '=', $id);
                return JWTAuth::fromUser($newusers->first());
            }
        }
    }
}
