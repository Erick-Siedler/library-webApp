<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    public function create(Request $request)
    {
        $data = $request->validate([
            'store_id' => 'required_without:id|nullable|integer|exists:stores,id',
            'id' => 'required_without:store_id|nullable|integer|exists:stores,id',
            'title' => 'required|min:3',
            'author' => 'required|min:3',
            'genre' => 'required|min:3',
            'publisher' => 'required|min:3',
            'pub_year' => 'required|integer',
            'ISBN' => 'required|min:13',
            'stock_quantity' => 'required|integer|min:0',
            'available' => 'required|boolean',
            'pdf' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $pdfPath = $request->hasFile('pdf')
            ? $request->file('pdf')->store('books/pdfs', 'public')
            : null;

        $book = Book::create([
            'store_id' => $data['store_id'] ?? $data['id'],
            'title' => $data['title'],
            'author' => $data['author'],
            'genre' => $data['genre'],
            'publisher' => $data['publisher'],
            'pub_year' => $data['pub_year'],
            'ISBN' => $data['ISBN'],
            'stock_quantity' => $data['stock_quantity'],
            'available' => $data['available'],
            'pdf_path' => $pdfPath,
        ]);

        if (! $book) {
            return response()->json([
                'success' => false,
                'message' => 'book creation failed',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'book created successfully',
            'book' => $this->bookWithPdfUrl($book),
        ], 201);
    }

    public function book($id)
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json([
                'success' => false,
                'message' => 'book not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'book' => $this->bookWithPdfUrl($book),
        ]);
    }

    public function destroy(Request $request)
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:books,id',
        ]);

        $book = Book::find($data['id']);

        if (! $book) {
            return response()->json([
                'success' => false,
                'message' => 'book not found',
            ], 404);
        }

        if ($book->pdf_path && Storage::disk('public')->exists($book->pdf_path)) {
            Storage::disk('public')->delete($book->pdf_path);
        }

        $book->delete();

        return response()->json([
            'success' => true,
            'message' => 'book deleted successfully',
        ]);
    }

    public function edit(Request $request)
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:books,id',
            'store_id' => 'sometimes|required|integer|exists:stores,id',
            'title' => 'sometimes|required|min:3',
            'author' => 'sometimes|required|min:3',
            'genre' => 'sometimes|required|min:3',
            'publisher' => 'sometimes|required|min:3',
            'pub_year' => 'sometimes|required|integer',
            'ISBN' => 'sometimes|required|min:13',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'available' => 'sometimes|required|boolean',
            'pdf' => 'sometimes|nullable|file|mimes:pdf|max:10240',
        ]);

        $book = Book::find($data['id']);

        if (! $book) {
            return response()->json([
                'success' => false,
                'message' => 'book not found',
            ], 404);
        }

        $fieldsToUpdate = [
            'store_id',
            'title',
            'author',
            'genre',
            'publisher',
            'pub_year',
            'ISBN',
            'stock_quantity',
            'available',
        ];

        foreach ($fieldsToUpdate as $field) {
            if (array_key_exists($field, $data)) {
                $book->{$field} = $data[$field];
            }
        }

        if ($request->hasFile('pdf')) {
            if ($book->pdf_path && Storage::disk('public')->exists($book->pdf_path)) {
                Storage::disk('public')->delete($book->pdf_path);
            }

            $book->pdf_path = $request->file('pdf')->store('books/pdfs', 'public');
        }

        $book->save();

        return response()->json([
            'success' => true,
            'message' => 'book updated successfully',
            'book' => $this->bookWithPdfUrl($book),
        ]);
    }

    private function bookWithPdfUrl(Book $book): array
    {
        $bookData = $book->toArray();
        $bookData['pdf_url'] = $book->pdf_path
            ? Storage::disk('public')->url($book->pdf_path)
            : null;

        return $bookData;
    }
}
