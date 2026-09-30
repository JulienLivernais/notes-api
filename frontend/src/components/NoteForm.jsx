import { useState } from "react";
import { createNote, updateNote } from "../api";

function NoteForm({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    try {
      const saved = note
        ? await updateNote(note.id, title, content)
        : await createNote(title, content);
      onSave(saved);
      if (!note) {
        setTitle("");
        setContent("");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={100}
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        rows={4}
      />
      <button type="submit">{note ? "Save" : "Add note"}</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default NoteForm;