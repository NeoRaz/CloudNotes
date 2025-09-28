<?php

namespace App\Http\Controllers\Note;

use App\Services\Note\NoteService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NoteController extends Controller
{
    protected $service;

    public function __construct(NoteService $service)
    {
        $this->service = $service;
    }

    public function allUserNotes(Request $request)
    {
        $userId = $request->user()->id;
        $result = $this->service->allUserNotes($userId);
        return response(successResponse($result));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority_id' => 'nullable|exists:priorities,id',
            'status_id' => 'nullable|exists:statuses,id',
            'is_pinned' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        $userId = $request->user()->id;
        $result = $this->service->create($data, $userId);
        return response(successResponse($result));
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority_id' => 'nullable|exists:priorities,id',
            'status_id' => 'nullable|exists:statuses,id',
            'is_pinned' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        $result = $this->service->update($id, $data);
        return response(successResponse($result));
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Note deleted']);
    }
}
