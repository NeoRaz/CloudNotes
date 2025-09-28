<?php

namespace App\Repositories\Note;

use App\Models\Note;

class NoteRepository
{
    public function allUserNotes(int $userId)
    {
        return Note::query()->where('user_id', $userId)->with(['status', 'priority'])->get();
    }

    public function find(int $id)
    {
        return Note::with(['status', 'priority'])->findOrFail($id);
    }

    public function create(array $data)
    {
        $note = Note::create($data);
        return $note->load(['status', 'priority']);
    }

    public function update(Note $note, array $data)
    {
        $note->update($data);
        return $note->load(['status', 'priority']);
    }

    public function delete(Note $note)
    {
        return $note->delete();
    }
}
