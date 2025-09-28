import React from "react";
import { Link } from "react-router-dom";

interface Props {
  onToggleSidebar: () => void;
}

const NotesHeader: React.FC<Props> = ({ onToggleSidebar }) => {
  return (
    <div className="d-md-flex d-block align-items-center justify-content-between mb-3 pb-3 border-bottom position-relative">
      <div className="my-auto mb-2">
        <h3 className="page-title mb-1">Notes</h3>
        <nav>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">Core</li>
            <li className="breadcrumb-item active" aria-current="page">
              List
            </li>
          </ol>
        </nav>
      </div>

      <Link
        id="toggle_btn2"
        className="notes-tog position-absolute start-0 avatar avatar-sm rounded-circle bg-primary text-white"
        to="#"
        onClick={(e) => {
          e.preventDefault();
          onToggleSidebar();
        }}
      >
        <i className="fas fa-chevron-left" />
      </Link>
    </div>
  );
};

export default NotesHeader;
