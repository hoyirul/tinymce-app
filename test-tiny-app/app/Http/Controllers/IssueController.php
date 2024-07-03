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

    public function uploadMedia(Request $request, Issue $issue)
    {
        // Validasi request untuk setiap file
        $request->validate([
            'files.*' => 'required|file|mimes:jpeg,png,pdf,xlsx,csv,txt|max:2048',
        ]);

        // Loop melalui setiap file yang diunggah
        foreach ($request->file('files') as $file) {
            $issue->addMedia($file)->toMediaCollection('attachments');
        }

        // Kembalikan respons JSON
        return response()->json(['message' => 'Files uploaded successfully'], 200);
    }

    // Delete by model
    public function deleteMedia(Issue $issue)
    {
        $issue->clearMediaCollection('attachments');

        return response()->json(['message' => 'Files deleted successfully'], 200);
    }

    // Delete by media id
    public function deleteMediaById(Request $request, Issue $issue)
    {
        $mediaId = $request->input('media_id');

        $media = $issue->media()->find($mediaId);

        if ($media) {
            $media->delete();
            return response()->json(['message' => 'File deleted successfully'], 200);
        }

        return response()->json(['error' => 'File not found'], 404);
    }

    public function getMediaByIssueId($issueId)
    {
        try {
            // Cari Issue berdasarkan ID
            $issue = Issue::findOrFail($issueId);

            // Ambil semua media dari koleksi 'attachments' milik Issue
            $media = $issue->getMedia('attachments');

            return response()->json($media, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Issue not found'], 404);
        }
    }
}
