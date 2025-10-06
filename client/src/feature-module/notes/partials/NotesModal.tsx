import React, { useEffect, useState } from "react";
import { Note } from "../../../types/note";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Selection } from "../../../types/selection";

interface Props {
  selectedNote: Note | null;
  onSave: (note: Note) => void;
  onDelete: (id?: number) => void;
  statuses?: Selection[];
  priorities?: Selection[];
  saving?: boolean; // <-- NEW: tells if save is in progress
}

const NotesModal: React.FC<Props> = ({
  selectedNote,
  onSave,
  statuses,
  priorities,
  saving = false,
}) => {
  const [form, setForm] = useState<Note>({
    id: undefined,
    title: "",
    description: "",
    status_id: 1,
    priority_id: 2,
    due_date: "",
    is_pinned: false,
  });

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (selectedNote) {
      console.log("Selected Note:", selectedNote);
      const formattedDueDate = selectedNote.due_date
      ? new Date(selectedNote.due_date).toISOString().split("T")[0]
      : undefined;

      setForm({
        id: selectedNote.id,
        title: selectedNote.title || "",
        description: selectedNote.description || "",
        status_id: selectedNote.status_id || 1,
        priority_id: selectedNote.priority_id || 2,
        due_date: formattedDueDate,
        is_pinned: selectedNote.is_pinned || false,
      });
    }
    setValidated(false); // reset validation when modal opens
  }, [selectedNote]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const checked =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : undefined;

    setForm((p) => ({
      ...p,
      [name]:
        type === "checkbox"
          ? checked
          : ["status_id", "priority_id"].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!form.title.trim()) {
      setValidated(true);
      return; // stop modal from closing
    }

    onSave(form);
    setValidated(false); // reset validation on success
  };

  return (
    <div
      className="modal fade"
      id="note-units"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <form className="modal-content" onSubmit={handleSave}>
          <div className="modal-header">
            <h5 className="modal-title">
              {form.id ? "Edit Note" : "Add Note"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            {/* Title */}
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className={`form-control ${
                  validated && !form.title.trim() ? "is-invalid" : ""
                }`}
              />
              {validated && !form.title.trim() && (
                <div className="invalid-feedback">Title is required.</div>
              )}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <ReactQuill
                theme="snow"
                value={form.description}
                onChange={(val) =>
                  setForm((p) => ({ ...p, description: val }))
                }
              />
            </div>

            {/* Status + Priority */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Status</label>
                <select
                  name="status_id"
                  value={form.status_id}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">-- Select Status --</option>
                  {statuses?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Priority</label>
                <select
                  name="priority_id"
                  value={form.priority_id}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">-- Select Priority --</option>
                  {priorities?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="mb-3">
              <label className="form-label">Due date</label>
              <input
                name="due_date"
                type="date"
                value={form.due_date ?? ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Pinned */}
            <div className="form-check">
              <input
                name="is_pinned"
                className="form-check-input"
                type="checkbox"
                checked={!!form.is_pinned}
                onChange={handleChange}
              />
              <label className="form-check-label">Pin note</label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary me-2"
              data-bs-dismiss="modal"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving && (
                <span className="spinner-border spinner-border-sm me-2" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotesModal;
