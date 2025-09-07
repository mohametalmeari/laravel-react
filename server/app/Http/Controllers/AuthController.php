<?php
namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            $credentials = $request->validated();
            $user        = User::create([
                'name'     => $credentials['name'],
                'email'    => $credentials['email'],
                'password' => bcrypt($credentials['password']),
            ]);
            $token = $user->createToken('main')->plainTextToken;

            return response()->json(['token' => $token], 201);
        } catch (\Throwable $th) {
            error_log('AUTH_CONTROLLER__REGISTER: ' . $th->getMessage());
            return response()->json(['message' => 'Registration failed'], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->validated();
            if (! Auth::attempt($credentials)) {
                return response(['message' => 'Provided email or password is incorrect']);
            }
            $user  = Auth::user();
            $token = $user->createToken('main')->plainTextToken;

            return response()->json(['token' => $token], 200);
        } catch (\Throwable $th) {
            error_log('AUTH_CONTROLLER__LOGIN: ' . $th->getMessage());
            return response()->json(['message' => 'Login failed'], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            $user->currentAccessToken()->delete();

            return response()->json('', 204);
        } catch (\Throwable $th) {
            error_log('AUTH_CONTROLLER__LOGOUT: ' . $th->getMessage());
            return response()->json(['message' => 'Logout failed'], 500);
        }
    }

    public function me(Request $request)
    {
        try {
            error_log('test');
            return $request->user();
        } catch (\Throwable $th) {
            error_log('AUTH_CONTROLLER__ME: ' . $th->getMessage());
            return response()->json(['message' => 'Fetch user info failed'], 500);
        }
    }
}
