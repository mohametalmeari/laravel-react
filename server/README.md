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

## Refactor Category Columns

```php
# server\database\migrations\2025_09_07_183349_create_categories_table.php
        Schema::create('categories', function (Blueprint $table) {
            $table->id(); #>
            $table->string('name')->unique();
            $table->timestamps(); #<
        });
```

```php
# server\app\Models\Category.php
class Category extends Model
{ #>
    protected $fillable = [
        'name',
    ];
} #<
```

```php
php artisan migrate
# or reset database
php artisan migrate:fresh
```

## Implement Categories Endpoints

```php
# server\app\Http\Controllers\CategoryController.php
class CategoryController extends Controller
{ #>
    public function index()
    {
        try {
            $categories = Category::all();

            return CategoryResource::collection($categories);
        } catch (\Throwable $th) {
            error_log('CATEGORY_CONTROLLER__INDEX: ' . $th->getMessage());
            return response()->json(['message' => 'Fetch categories failed'], 500);
        }
    }

    public function store(StoreCategoryRequest $request)
    {
        try {
            $category = Category::create($request->validated());

            return new CategoryResource($category);
        } catch (\Throwable $th) {
            error_log('CATEGORY_CONTROLLER__STORE: ' . $th->getMessage());
            return response()->json(['message' => 'Create category failed'], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $category = Category::findOrFail($id);

            return new CategoryResource($category);
        } catch (\Throwable $th) {
            error_log('CATEGORY_CONTROLLER__SHOW: ' . $th->getMessage());
            return response()->json(['message' => 'Fetch category failed'], 500);
        }
    }

    public function update(UpdateCategoryRequest $request, string $id)
    {
        try {
            $data     = $request->validated();
            $category = Category::findOrFail($id);
            $category->update($data);

            return new CategoryResource($category);
        } catch (\Throwable $th) {
            error_log('CATEGORY_CONTROLLER__UPDATE: ' . $th->getMessage());
            return response()->json(['message' => 'Update category failed'], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $category = Category::findOrFail($id);
            $category->delete();

            return response()->json("", 204);
        } catch (\Throwable $th) {
            error_log('CATEGORY_CONTROLLER__DESTROY: ' . $th->getMessage());
            return response()->json(['message' => 'Delete category failed'], 500);
        }
    }
} #<
```

```php
# server\app\Http\Requests\StoreCategoryRequest.php
    public function authorize(): bool
    { #>
        return true;
    } #<

    public function rules(): array
    {
        return [ #>
            "name" => "required|string|max:55|unique:categories,name",
        ]; #<
    }
```

```php
# server\app\Http\Requests\UpdateCategoryRequest.php
    public function authorize(): bool
    { #>
        return true;
    } #<

    public function rules(): array
    {
        return [ #>
            "name" => "required|string|max:55|unique:categories,name" . $this->route('id'),
        ]; #<
    }
```

```php
# server\app\Http\Resources\CategoryResource.php
    public function toArray(Request $request): array
    { #>
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    } #<
```

```php
# server\routes\api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/categories', [CategoryController::class, 'store']); # +
    Route::put('/categories/{id}', [CategoryController::class, 'update']); # +
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']); # +
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/categories', [CategoryController::class, 'index']); # +
Route::get('/categories/{id}', [CategoryController::class, 'show']); # +
```

## Generate Model/Controller/Requests and Resource for Products

```bash
php artisan make:model Product -m -c -R --api
php artisan make:resource ProductResource
```

## Refactor Product Columns

```php
# server\database\migrations\2025_09_07_200301_create_products_table.php
        Schema::create('products', function (Blueprint $table) {  #>
            $table->uuid('id')->primary();
            $table->string('name', 55);
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2);
            $table->timestamps();

            $table->foreignId('category_id')->constrained()->onDelete('cascade');

            $table->softDeletes(); // Optional
        }); #<
```

```php
# server\app\Models\Product.php
class Product extends Model
{ #>
    use HasUuids;

    protected $fillable = [
        'name',
        'description',
        'price',

        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
} #<
```

```php
# server\app\Models\Category.php
class Category extends Model
{
    protected $fillable = [
        'name',
    ];
    #>
    public function products()
    {
        return $this->hasMany(Product::class);
    }
} #<
```

```php
php artisan migrate
# or reset database
php artisan migrate:fresh
```

## Implement Products Endpoints

```php
# server\app\Http\Controllers\ProductController.php
class ProductController extends Controller
{ #>
    public function index()
    {
        try {
            $products = Product::all();

            return ProductResource::collection($products);
        } catch (\Throwable $th) {
            error_log('PRODUCT_CONTROLLER__INDEX: ' . $th->getMessage());
            return response()->json(['message' => 'Fetch products failed'], 500);
        }
    }

    public function store(StoreProductRequest $request)
    {
        try {
            $product = Product::create($request->validated());

            return new ProductResource($product);
        } catch (\Throwable $th) {
            error_log('PRODUCT_CONTROLLER__STORE: ' . $th->getMessage());
            return response()->json(['message' => 'Create product failed'], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $product = Product::findOrFail($id);

            return new ProductResource($product);
        } catch (\Throwable $th) {
            error_log('PRODUCT_CONTROLLER__SHOW: ' . $th->getMessage());
            return response()->json(['message' => 'Fetch product failed'], 500);
        }
    }

    public function update(UpdateProductRequest $request, string $id)
    {
        try {
            $data    = $request->validated();
            $product = Product::findOrFail($id);
            $product->update($data);

            return new ProductResource($product);
        } catch (\Throwable $th) {
            error_log('PRODUCT_CONTROLLER__UPDATE: ' . $th->getMessage());
            return response()->json(['message' => 'Update product failed'], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();

            return response()->json("", 204);
        } catch (\Throwable $th) {
            error_log('PRODUCT_CONTROLLER__DESTROY: ' . $th->getMessage());
            return response()->json(['message' => 'Delete product failed'], 500);
        }
    }
} #<
```

```php
# server\app\Http\Requests\StoreProductRequest.php
    public function authorize(): bool
    { #>
        return true;
    } #<

    public function rules(): array
    {
        return [ #>
            'name'        => 'required|string|max:55',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',

            'category_id' => 'required|exists:categories,id',
        ]; #<
    }
```

```php
# server\app\Http\Requests\UpdateProductRequest.php
    public function authorize(): bool
    { #>
        return true;
    } #<

    public function rules(): array
    {
        return [ #>
            'name'        => 'required|string|max:55',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',

            'category_id' => 'required|exists:categories,id',
        ]; #<
    }
```

```php
# server\app\Http\Resources\ProductResource.php
    public function toArray(Request $request): array
    { #>
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'price'       => $this->price,
            'created_at'  => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at'  => $this->updated_at->format('Y-m-d H:i:s'),

            'category_id' => $this->category_id,
        ];
    } #<
```

```php
# server\app\Http\Resources\CategoryResource.php
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            #>
            'products'   => $this->products,
            'products'   => ProductResource::collection($this->whenLoaded('products')),
        ]; #<
    }
```

```php
# server\routes\api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    Route::post('/products', [ProductController::class, 'store']); # +
    Route::put('/products/{id}', [ProductController::class, 'update']); # +
    Route::delete('/products/{id}', [ProductController::class, 'destroy']); # +
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']); # +
Route::get('/products/{id}', [ProductController::class, 'show']); # +
```

## Generate Model and Resource for Colors

```bash
php artisan make:model Color -m
php artisan make:migration create_color_product_table --create=color_product
php artisan make:resource ColorResource
```

## Refactor Color Columns

```php
# server\database\migrations\2025_09_07_225349_create_colors_table.php
        Schema::create('colors', function (Blueprint $table) { #>
            $table->id();
            $table->string('name');
            $table->string('hex_code');
            $table->timestamps();

            $table->unique(['name', 'hex_code']);
        }); #<
```

```php
# server\database\migrations\2025_09_07_230438_create_color_product_table.php
        Schema::create('color_product', function (Blueprint $table) {
            $table->id(); #>
            $table->foreignUuid('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('color_id')->constrained()->onDelete('cascade');
            $table->timestamps(); #<
        });
```

```php
# server\app\Models\Color.php
class Color extends Model
{ #>
    protected $fillable = [
        'name',
        'hex_code',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
} #<
```

```php
# server\app\Models\Product.php
class Product extends Model
{
    ...

    #>
    public function colors()
    {
        return $this->belongsToMany(Color::class);
    }
} #<
```

```php
php artisan migrate
# or reset database
php artisan migrate:fresh
```

## Update Products Controllers

```php
# server\app\Http\Controllers\ProductController.php
    public function store(StoreProductRequest $request)
    {
        try {
            $product = Product::create($request->validated());
            #>
            if ($request->has('colors')) {
                $colorIds = [];
                foreach ($request->colors as $name => $hex_code) {
                    $color      = Color::firstOrCreate(['name' => $name, 'hex_code' => $hex_code]);
                    $colorIds[] = $color->id;
                }
                $product->colors()->sync($colorIds);
            }
            #<
            return new ProductResource($product);
            ...

    public function update(UpdateProductRequest $request, string $id)
    {
        try {
            $data    = $request->validated();
            $product = Product::findOrFail($id);
            $product->update($data);
            #>
            if ($request->has('colors')) {
                $colorIds = [];
                foreach ($request->colors as $name => $hex_code) {
                    $color      = Color::firstOrCreate(['name' => $name, 'hex_code' => $hex_code]);
                    $colorIds[] = $color->id;
                }
                $product->colors()->sync($colorIds);
            }
            #<
            return new ProductResource($product);
            ...
```

```php
# server\app\Http\Resources\ProductResource.php
    public function toArray(Request $request): array
    {
        return [
            ...
            #>
            'colors'      => $this->colors,
            'colors'      => ColorResource::collection($this->whenLoaded('colors')),
        ]; #<
    }
```

```php
# server\app\Http\Resources\ColorResource.php
    public function toArray(Request $request): array
    { #>
        return [
            'id'       => $this->id,
            'name'     => $this->name,
            'hex_code' => $this->hex_code,
        ];
    } #<
```

## Generate AdminOnly Middleware

```bash
php artisan make:middleware AdminOnly
php artisan make:migration add_is_admin_to_users_table --table=users
```

## Add is_admin Column to Users

```php
# server\database\migrations\2025_09_07_235059_add_is_admin_to_users_table.php
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('password'); # +
        });

        ...

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_admin'); # +
        });
```

```php
# server\app\Models\User.php
    protected $fillable = [
        ...

        'is_admin', # +
    ];
```

```php
php artisan migrate
# or reset database
php artisan migrate:fresh
```

```bash
php artisan tinker
>
\App\Models\User::create([
    'name'     => 'Admin',
    'email'    => 'admin@example.com',
    'password' => \Illuminate\Support\Facades\Hash::make('Admin@78'),
    'is_admin' => true,
]);
>
exit
```
