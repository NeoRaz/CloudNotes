import React, { useState, useMemo } from "react";
import NoteCard from "./NoteCard";
import { Note } from "../../../types/note";
import { Selection } from "../../../types/selection";

interface Props {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  pageSize?: number;
  mapStatus: Record<Selection["id"], string>;
  mapPriority: Record<Selection["id"], string>;
}

const NotesContent: React.FC<Props> = ({ notes, onEdit, onDelete, pageSize = 15, mapStatus, mapPriority }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // filter notes based on search term
  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) return notes;
    return notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

  // pagination logic
  const totalPages = Math.ceil(filteredNotes.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentNotes = filteredNotes.slice(startIndex, startIndex + pageSize);

  // reset page when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center text-muted">
        No notes available. Add one to get started.
      </div>
    );
  }

  return (
    <div>
      {/* Search bar */}
      <div className="mb-3 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Notes grid */}
      <div className="row">
        {currentNotes.length > 0 ? (
          currentNotes.map((note) => (
            <div className="col-md-6 col-xl-4 mb-4" key={note.id}>
              <NoteCard note={note} onEdit={onEdit} onDelete={onDelete} mapStatus={mapStatus} mapPriority={mapPriority}/>
            </div>
          ))
        ) : (
          <div className="text-center text-muted">No matching notes found.</div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, idx) => (
              <li
                key={idx}
                className={`page-item ${currentPage === idx + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>
                  {idx + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default NotesContent;
