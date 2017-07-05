<?php

namespace App\Http\Controllers;

// app/Http/controllers/AuthenticateController.php

use Illuminate\Http\Request;

use Config;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\User;
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
       $this->middleware('jwt.auth', ['except' => ['authenticate', 'register', 'facebook', 'twitter']]);
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
                $user->name = $user->name ?: $profile['name'];
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

    /**
     * Login with Twitter.
     */
    public function twitter(Request $request)
    {
        $stack = GuzzleHttp\HandlerStack::create();
        // Part 1 of 2: Initial request from Satellizer.
        if (!$request->input('oauth_token') || !$request->input('oauth_verifier'))
        {
            $stack = GuzzleHttp\HandlerStack::create();
            $requestTokenOauth = new Oauth1([
              'consumer_key' => Config::get('app.twitter_key'),
              'consumer_secret' => Config::get('app.twitter_secret'),
              'callback' => $request->input('redirectUri'),
              'token' => '',
              'token_secret' => ''
            ]);
            $stack->push($requestTokenOauth);
            $client = new GuzzleHttp\Client([
                'handler' => $stack
            ]);
            // Step 1. Obtain request token for the authorization popup.
            $requestTokenResponse = $client->request('POST', 'https://api.twitter.com/oauth/request_token', [
                'auth' => 'oauth'
            ]);
            $oauthToken = array();
            parse_str($requestTokenResponse->getBody(), $oauthToken);
            // Step 2. Send OAuth token back to open the authorization screen.
            return response()->json($oauthToken);
        }
        // Part 2 of 2: Second request after Authorize app is clicked.
        else
        {
            $accessTokenOauth = new Oauth1([
                'consumer_key' => Config::get('app.twitter_key'),
                'consumer_secret' => Config::get('app.twitter_secret'),
                'token' => $request->input('oauth_token'),
                'verifier' => $request->input('oauth_verifier'),
                'token_secret' => ''
            ]);
            $stack->push($accessTokenOauth);
            $client = new GuzzleHttp\Client([
                'handler' => $stack
            ]);
            // Step 3. Exchange oauth token and oauth verifier for access token.
            $accessTokenResponse = $client->request('POST', 'https://api.twitter.com/oauth/access_token', [
                'auth' => 'oauth'
            ]);
            $accessToken = array();
            parse_str($accessTokenResponse->getBody(), $accessToken);
            $profileOauth = new Oauth1([
                'consumer_key' => Config::get('app.twitter_key'),
                'consumer_secret' => Config::get('app.twitter_secret'),
                'oauth_token' => $accessToken['oauth_token'],
                'token_secret' => ''
            ]);
            $stack->push($profileOauth);
            $client = new GuzzleHttp\Client([
                'handler' => $stack
            ]);
            // Step 4. Retrieve profile information about the current user.
            $profileResponse = $client->request('GET', 'https://api.twitter.com/1.1/users/show.json?screen_name=' . $accessToken['screen_name'], [
                'auth' => 'oauth'
            ]);


            $profile = json_decode($profileResponse->getBody(), true);
            // Step 5. Try to authenticate user with Twitter id
            $user = User::where('twitter', '=', $profile['id']);
            if ($user->first()) {
                Log::info('AUTH - Twitter user retrieved from Twitter ID');
                return JWTAuth::fromUser($user->first());

            } else {
                // Step 3. Create a new user and authenticate it
                // we can't get address email from Twitter
                Log::info('AUTH - No Twitter user retrieved, we create a new one');
                $now = new DateTime();
                $id = User::insertGetId(
                    [
                        'name' => $profile['screen_name'],
                        'twitter' => $profile['id'],
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
