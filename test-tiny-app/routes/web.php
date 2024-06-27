<?php

use App\Http\Controllers\IssueController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post('/upload-image', [IssueController::class, 'uploadImage']);
Route::post('/save-content', [IssueController::class, 'saveContent']);
Route::post('/delete-image', [IssueController::class, 'deleteImage']);
Route::get('/issue/{id}', [IssueController::class, 'show']);

// Upload media
Route::post('/issue/{issue}/media', [IssueController::class, 'uploadMedia']);
// Delete media
Route::delete('/issue/{issue}/media', [IssueController::class, 'deleteMedia']);
// Get media
Route::get('/issue/{issue}/media', [IssueController::class, 'getMediaByIssueId']);
