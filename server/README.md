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