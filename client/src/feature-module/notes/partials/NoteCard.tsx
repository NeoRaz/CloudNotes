import React, { useState } from "react";
import { Note } from "../../../types/note";
import { Modal } from "react-bootstrap";
import DOMPurify from "dompurify";
import { Selection } from "../../../types/selection";

interface Props {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  mapStatus: Record<Selection["id"], string>;
  mapPriority: Record<Selection["id"], string>;
}

const NoteCard: React.FC<Props> = ({ note, onEdit, onDelete, mapStatus, mapPriority}) => {
  const [showModal, setShowModal] = useState(false);

  const getStatusName = (id?: number) => (id ? mapStatus[id] ?? "" : "");
  const getPriorityName = (id?: number) => (id ? mapPriority[id] ?? "" : ""); 

  return (
    <>
      {/* Card */}
      <div className="card h-100 shadow-sm">
        <div
          className="card-body d-flex flex-column"
          style={{ cursor: "pointer" }}
          onClick={() => setShowModal(true)}
        >
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">{note.title}</h5>
            {note.is_pinned && (
              <span className="badge bg-warning text-dark">📌</span>
            )}
          </div>

          <div className="mb-2">
            <span className="badge bg-info me-1">{getStatusName(note.status_id)}</span>
            <span className="badge bg-secondary">{getPriorityName(note.priority_id)}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Due:{" "}
              {note.due_date
                ? new Date(note.due_date).toLocaleDateString()
                : "N/A"}
            </small>
            <div
              className="ms-2"
              onClick={(e) => e.stopPropagation()} // prevent modal from opening
            >
              <button
                type="button"
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => onEdit(note)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(note)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full View Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{note.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Full Quill HTML rendering */}
          
          <div
            style={{
              maxHeight: "60vh", // adjust as needed
              overflowY: "auto",
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(note.description),
              }}
            />
          </div>
          <div className="mt-3">
              <span className="badge bg-info me-1">{getStatusName(note.status_id)}</span>
            <span className="badge bg-secondary">{getPriorityName(note.priority_id)}</span>
          </div>
          <p className="mt-2">
            <strong>Due:</strong>{" "}
            {note.due_date
              ? new Date(note.due_date).toLocaleDateString()
              : "N/A"}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NoteCard;
