import { getRequest, postRequest } from '../../../api/api';
import toast from 'react-hot-toast';

const notifyError = (message) => {
  toast.error(message, { duration: 5000 });
};

// Fetch all notes
export function getNotes() {
  return new Promise((resolve, reject) => {
    try {
      getRequest('/api/note/all-user-notes', {}, (response) => {
        resolve(response);
      }).catch((error) => reject(error));
    } catch (error) {
      notifyError(error.message);
      reject(error);
    }
  });
}

// Fetch all statuses
export function getStatuses() {
  return new Promise((resolve, reject) => {
    try {
      getRequest('/api/utility/all-statuses', {}, (response) => {
        resolve(response);
      }).catch((error) => reject(error));
    } catch (error) {
      notifyError(error.message);
      reject(error);
    }
  });
}

// Fetch all priorities
export function getPriorities() {
  return new Promise((resolve, reject) => {
    try {
      getRequest('/api/utility/all-priorities', {}, (response) => {
        resolve(response);
      }).catch((error) => reject(error));
    } catch (error) {
      notifyError(error.message);
      reject(error);
    }
  });
}

// Create a new note
export function postCreateNote(values) {
  return new Promise((resolve, reject) => {
    try {
      postRequest('/api/note/create', {}, values, (response) => {
        resolve(response);
      }).catch((error) => reject(error));
    } catch (error) {
      notifyError(error.message);
      reject(error);
    }
  });
}

// Update an existing note
export function postUpdateNote(noteId, values) {
  return new Promise((resolve, reject) => {
    try {
      postRequest(`/api/note/update/${noteId}`, {}, values, (response) => {
        resolve(response);
      }).catch((error) => reject(error));
    } catch (error) {
      notifyError(error.message);
      reject(error);
    }
  });
}

// Delete a note
export function postDeleteNote(noteId) {
  return new Promise((resolve, reject) => {
    try {
      postRequest(`/api/note/delete/${noteId}`, {}, {}, (response) => {
        resolve(response);
      }).catch((error) => reject(error));
    } catch (error) {
      notifyError(error.message);
      reject(error);
    }
  });

 
}
