import { useEffect, useState } from "react";
import { getNotes, deleteNote } from "../api";
import NoteForm from "./NoteForm";

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getNotes()
      .then((data) =>
        setNotes(data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)))
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(newNote) {
    setNotes([newNote, ...notes]);
  }

  function handleUpdated(updatedNote) {
    setNotes([updatedNote, ...notes.filter((note) => note.id !== updatedNote.id)]);
    setEditingId(null);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this note?")) {
      return;
    }
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p>Loading notes...</p>;
  }

  return (
    <section>
      <h2>New note</h2>
      <NoteForm onSave={handleCreated} />

      <h2>My notes</h2>

      {error && <p className="error">{error}</p>}

      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              {editingId === note.id ? (
                <NoteForm
                  note={note}
                  onSave={handleUpdated}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <small>Updated {new Date(note.updated_at).toLocaleString()}</small>
                  <button onClick={() => setEditingId(note.id)}>Edit</button>
                  <button onClick={() => handleDelete(note.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default NoteList;