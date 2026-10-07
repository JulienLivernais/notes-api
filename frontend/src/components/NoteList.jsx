import { useEffect, useState } from "react";
import { getNotes, deleteNote } from "../api";
import NoteForm from "./NoteForm";

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    getNotes()
      .then((data) =>
        setNotes(data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)))
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSaved(savedNote) {
    setNotes([savedNote, ...notes.filter((note) => note.id !== savedNote.id)]);
    setEditingNote(null);
  }

  function handleEdit(note) {
    setEditingNote(note);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this note?")) {
      return;
    }
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
      if (editingNote && editingNote.id === id) {
        setEditingNote(null);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p className="empty">Loading notes...</p>;
  }

  return (
    <>
      <NoteForm
        key={editingNote ? editingNote.id : "new"}
        note={editingNote}
        onSave={handleSaved}
        onCancel={editingNote ? () => setEditingNote(null) : null}
      />

      {error && <p className="error">{error}</p>}

      <h2 className="section-title">My notes</h2>

      {notes.length === 0 ? (
        <p className="empty">No notes yet.</p>
      ) : (
        <ul className="note-grid">
          {notes.map((note) => (
            <li
              key={note.id}
              className={editingNote && editingNote.id === note.id ? "note-card editing" : "note-card"}
            >
              <h3>{note.title}</h3>
              <div className="note-actions">
                <button onClick={() => handleEdit(note)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(note.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default NoteList;