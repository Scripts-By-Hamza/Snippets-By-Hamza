document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const notesList = document.querySelector('.notes-list');
    const newNoteBtn = document.querySelector('.new-note-btn');
    const noteTitleInput = document.querySelector('.note-title-input');
    const noteBodyInput = document.querySelector('.note-body-input');
    const saveNoteBtn = document.querySelector('.save-note-btn');
    const deleteNoteBtn = document.querySelector('.delete-note-btn');

    // State
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let activeNoteId = null;

    // Render the list of notes in the sidebar
    const renderNotes = () => {
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.classList.add('note-item');
            if (note.id === activeNoteId) {
                noteItem.classList.add('active');
            }
            noteItem.dataset.id = note.id;
            noteItem.textContent = note.title || 'Untitled Note';
            notesList.appendChild(noteItem);
        });
    };

    // Save notes to local storage
    const saveNotes = () => {
        localStorage.setItem('notes', JSON.stringify(notes));
    };

    // Open a note for editing
    const openNote = (note) => {
        activeNoteId = note.id;
        noteTitleInput.value = note.title || '';
        noteBodyInput.value = note.body || '';
        renderNotes();
    };

    // Create a new note
    const createNewNote = () => {
        const newNote = {
            id: Date.now(),
            title: '',
            body: '',
            createdAt: new Date().toISOString()
        };
        notes.unshift(newNote); // Add to the beginning of the array
        saveNotes();
        openNote(newNote);
        noteTitleInput.focus();
    };

    // Save the currently active note
    const saveActiveNote = () => {
        if (!activeNoteId) return;
        
        const activeNote = notes.find(note => note.id === activeNoteId);
        if (activeNote) {
            activeNote.title = noteTitleInput.value.trim();
            activeNote.body = noteBodyInput.value;
            activeNote.updatedAt = new Date().toISOString();
            saveNotes();
            renderNotes();
        }
    };

    // Delete the currently active note
    const deleteActiveNote = () => {
        if (!activeNoteId) return;
        
        if (confirm('Are you sure you want to delete this note?')) {
            notes = notes.filter(note => note.id !== activeNoteId);
            saveNotes();
            activeNoteId = null;
            noteTitleInput.value = '';
            noteBodyInput.value = '';
            renderNotes();
        }
    };

    // Event Listeners
    notesList.addEventListener('click', (e) => {
        const noteItem = e.target.closest('.note-item');
        if (noteItem) {
            const noteId = Number(noteItem.dataset.id);
            const noteToOpen = notes.find(note => note.id === noteId);
            if (noteToOpen) {
                openNote(noteToOpen);
            }
        }
    });

    // Auto-save when typing after a delay
    let saveTimeout;
    const handleNoteChange = () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveActiveNote, 1000);
    };

    noteTitleInput.addEventListener('input', handleNoteChange);
    noteBodyInput.addEventListener('input', handleNoteChange);

    // Button event listeners
    newNoteBtn.addEventListener('click', createNewNote);
    saveNoteBtn.addEventListener('click', saveActiveNote);
    deleteNoteBtn.addEventListener('click', deleteActiveNote);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Save on Ctrl+S or Cmd+S
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveActiveNote();
        }
        // New note on Ctrl+N or Cmd+N
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            createNewNote();
        }
    });

    // Load the most recent note on startup if available
    if (notes.length > 0) {
        openNote(notes[0]);
    } else {
        createNewNote();
    }
});
