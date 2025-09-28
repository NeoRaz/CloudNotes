import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { all_routes } from "../router/all_routes";
import { Note } from "../../types/note";
import { getStatuses, getPriorities, postCreateNote } from "./src/noteApis";
import { Selection } from "../../types/selection";

const TakeNote: React.FC = () => {
  const route = all_routes;
  const navigate = useNavigate();

  const [form, setForm] = useState<Note>({
    title: "",
    description: "",
    status_id: 1,
    priority_id: 2,
    due_date: "",
    is_pinned: false,
  });

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false); // for save button
  const [pageLoading, setPageLoading] = useState(true); // for initial load
  const [statuses, setStatuses] = useState<Selection[]>([]);
  const [priorities, setPriorities] = useState<Selection[]>([]);

  useEffect(() => {
    // Fetch Statuses and Priorities from API
    Promise.all([getStatuses(), getPriorities()])
      .then(([statusesRes, prioritiesRes]) => {
        const mappedStatuses: Selection[] = statusesRes.data.data.map(
          (item: any) => ({
            id: item.id,
            title: item.name,
          })
        );
        const mappedPriorities: Selection[] = prioritiesRes.data.data.map(
          (item: any) => ({
            id: item.id,
            title: item.name,
          })
        );

        setStatuses(mappedStatuses);
        setPriorities(mappedPriorities);
      })
      .catch(() => toast.error("Failed to load selections"))
      .finally(() => setPageLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const checked =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : undefined;

    const numericFields = ["status_id", "priority_id"];
    const parsedValue = numericFields.includes(name) ? Number(value) : value;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : parsedValue,
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setValidated(true);
      return;
    }

    setLoading(true);
    postCreateNote(form)
      .then(() => {
        toast.success("Note created successfully");
        navigate(route.noteList);
      })
      .catch(() => toast.error("Failed to create note"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="page-wrapper">
      {/* Full page loading overlay for initial load */}
      {pageLoading && (
        <div id="global-loader">
          <div className="page-loader"></div>
        </div>
      )}

      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Create Note</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">Core</li>
                <li className="breadcrumb-item">
                  <Link to={route.noteList}>Notes</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Create
                </li>
              </ol>
            </nav>
          </div>
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary d-flex align-items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">
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
                placeholder="Enter note title"
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
                onChange={(val) => setForm((p) => ({ ...p, description: val }))}
              />
            </div>

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
              <label className="form-label">Due Date</label>
              <input
                name="due_date"
                type="date"
                value={form.due_date ?? ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Pinned */}
            <div className="form-check mb-3">
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
        </div>
      </div>
    </div>
  );
};

export default TakeNote;
