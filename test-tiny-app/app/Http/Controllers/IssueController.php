<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class IssueController extends Controller
{
    public function uploadImage(Request $request)
    {
        if ($request->hasFile('upload')) {
            $file = $request->file('upload');
            $path = $file->store('public/uploads');
            $url = Storage::url($path);
            $fullUrl = url($url);
            return response()->json(['url' => $fullUrl]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function saveContent(Request $request)
    {
        $title = 'Testing title';
        $description = $request->input('description');

        $issue = new Issue();
        $issue->title = $title;
        $issue->description = $description;
        $issue->save();

        return response()->json(['success' => true]);
    }

    public function deleteImage(Request $request)
    {
        $imageUrl = $request->input('url'); // Ambil URL gambar dari request

        // Ubah URL relatif menjadi path lokal di storage
        $path = str_replace(url('/'), public_path(), $imageUrl);

        if (file_exists($path)) {
            unlink($path); // Hapus file dari storage
            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'File not found'], 404);
    }

    public function show($id)
    {
        $issue = Issue::find($id);

        return response()->json($issue);
    }
}
