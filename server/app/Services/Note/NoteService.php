<?php

namespace App\Services\Note;

use App\Repositories\Note\NoteRepository;

class NoteService
{
    protected $repo;

    public function __construct(NoteRepository $repo)
    {
        $this->repo = $repo;
    }

    public function allUserNotes(int $userId)
    {
        return $this->repo->allUserNotes($userId);
    }

    public function create(array $data, int $userId)
    {
        $data['user_id'] = $userId;
        return $this->repo->create($data, $userId);
    }

    public function update(int $id, array $data)
    {
        $note = $this->repo->find($id);
        return $this->repo->update($note, $data);
    }

    public function delete(int $id)
    {
        $note = $this->repo->find($id);
        return $this->repo->delete($note);
    }
}
