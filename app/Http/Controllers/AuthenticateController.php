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


class AuthenticateController extends Controller
{

    public function __construct()
    {
       // Apply the jwt.auth middleware to all methods in this controller
       // except for the authenticate method. We don't want to prevent
       // the user from retrieving their token if they don't already have it
       $this->middleware('jwt.auth', ['except' => ['authenticate', 'register']]);
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
}
