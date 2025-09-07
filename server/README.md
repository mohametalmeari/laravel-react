## Install Laravel API

```bash
composer create-project laravel/laravel server
cd server
php artisan install:api
php artisan serve
```

## Generate Auth Controller/Requests

```bash
php artisan make:controller AuthController
php artisan make:request RegisterRequest
php artisan make:request LoginRequest
```

## Implement authentication endpoints

```php
# server\app\Http\Controllers\AuthController.php
class AuthController extends Controller
{ #>
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
} #<
```

```php
# server\app\Http\Requests\RegisterRequest.php
    public function authorize(): bool
    { #>
        return true;
    } #<

    public function rules(): array
    {
        return [ #>
            'name'     => 'required|string|max:55',
            'email'    => 'required|email|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
            ],
        ]; #<
    }
```

```php
# server\app\Http\Requests\LoginRequest.php
    public function authorize(): bool
    { #>
        return true;
    } #<

    public function rules(): array
    {
        return [ #>
            'email'    => 'required|email|exists:users,email',
            'password' => 'required',
        ]; #<
    }
```

```php
# server\app\Models\User.php
class User extends Authenticatable
{ #>
    use HasApiTokens, HasFactory, Notifiable;
```

```php
# server\routes\api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
```

## Generate Model/Controller/Requests and Resource for Categories
```bash
php artisan make:model Category -m -c -R --api
php artisan make:resource CategoryResource
```