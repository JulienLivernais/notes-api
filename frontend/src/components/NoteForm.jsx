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
    <form className="editor" onSubmit={handleSubmit}>
      <input
        className="editor-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={100}
        required
      />
      <textarea
        className="editor-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
      />
      {error && <p className="error">{error}</p>}
      <div className="editor-actions">
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit">{note ? "Save" : "Add note"}</button>
      </div>
    </form>
  );
}

export default NoteForm;