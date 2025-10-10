// Make sure to include the Firebase SDKs in your HTML file before this script
// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>
// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const notesList = document.querySelector('.notes-list');
    const newNoteBtn = document.querySelector('.new-note-btn');
    const noteTitleInput = document.querySelector('.note-title-input');
    const noteBodyInput = document.querySelector('.note-body-input');
    const saveNoteBtn = document.querySelector('.save-note-btn');
    const deleteNoteBtn = document.querySelector('.delete-note-btn');

    let notes = [];
    let activeNoteId = null;

    const renderNotes = () => {
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.classList.add('note-item');
            if (note.id === activeNoteId) {
                noteItem.classList.add('active');
            }
            noteItem.dataset.id = note.id;
            noteItem.textContent = note.title || 'New Note';
            notesList.appendChild(noteItem);
        });
    };

    const openNote = (note) => {
        activeNoteId = note.id;
        noteTitleInput.value = note.title;
        noteBodyInput.value = note.body;
        renderNotes();
    };

    const createNewNote = () => {
        const newNote = {
            title: '',
            body: '',
            createdAt: new Date()
        };
        db.collection('notes').add(newNote).then(docRef => {
            newNote.id = docRef.id;
            notes.push(newNote);
            openNote(newNote);
        });
    };

    const saveActiveNote = () => {
        if (activeNoteId) {
            const activeNote = notes.find(note => note.id === activeNoteId);
            if (activeNote) {
                activeNote.title = noteTitleInput.value;
                activeNote.body = noteBodyInput.value;
                db.collection('notes').doc(activeNoteId).set({
                    title: activeNote.title,
                    body: activeNote.body
                }, { merge: true }).then(() => {
                    renderNotes();
                });
            }
        }
    };

    const deleteActiveNote = () => {
        if (activeNoteId && confirm('Are you sure you want to delete this note?')) {
            db.collection('notes').doc(activeNoteId).delete().then(() => {
                notes = notes.filter(note => note.id !== activeNoteId);
                activeNoteId = null;
                noteTitleInput.value = '';
                noteBodyInput.value = '';
                renderNotes();
            });
        }
    };

    const loadNotes = () => {
        db.collection('notes').orderBy('createdAt', 'desc').get().then((querySnapshot) => {
            notes = [];
            querySnapshot.forEach((doc) => {
                const note = doc.data();
                note.id = doc.id;
                notes.push(note);
            });
            renderNotes();
        });
    };

    notesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('note-item')) {
            const noteId = e.target.dataset.id;
            const noteToOpen = notes.find(note => note.id === noteId);
            if (noteToOpen) {
                openNote(noteToOpen);
            }
        }
    });

    newNoteBtn.addEventListener('click', createNewNote);
    saveNoteBtn.addEventListener('click', saveActiveNote);
    deleteNoteBtn.addEventListener('click', deleteActiveNote);

    loadNotes();
});
