import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UniqueID from "@tiptap-pro/extension-unique-id";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc,onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDp7ghSyKhc2u_MN-iLtZRBn17-zinl_24",
  authDomain: "testexperiments-8356a.firebaseapp.com",
  projectId: "testexperiments-8356a",
  storageBucket: "testexperiments-8356a.firebasestorage.app",
  messagingSenderId: "833978223157",
  appId: "1:833978223157:web:a79f5f8dad9c37fb703f7c",
  measurementId: "G-DP4268BVCY",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [savedNotes, setSavedNotes] = useState([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UniqueID.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getJSON().content;
      const elements = updatedContent
        ?.filter((node) => node.type === "paragraph" || node.type === "heading")
        .map((node) => ({
          id: node.attrs?.id || "",
          text: node.content?.map((textNode) => textNode.text).join(" ") || "",
        }));

      if (elements && elements.length > 0) {
        saveContentToFirebase(elements);
      }
    },
  });

  const saveContentToFirebase = async (content) => {
    try {
      const docRef = doc(db, "notes", "tiptapNotes");
  
      // Fetch existing data to preserve the `ids` array
      const docSnap = await getDoc(docRef);
      let existingIds = [];
      if (docSnap.exists()) {
        existingIds = docSnap.data().ids || [];
      }
  
      const updates = {};
      const newIds = [];
  
      content.forEach((item) => {
        updates[item.id] = item.text;
        newIds.push(item.id);
      });
  
      // Merge new IDs with existing IDs
      const mergedIds = Array.from(new Set([...existingIds, ...newIds]));
  
      await setDoc(
        docRef,
        {
          ...updates,
          ids: mergedIds,
        },
        { merge: true }
      );
  
      console.log("Content and IDs saved successfully!");
    } catch (error) {
      console.error("Error saving content to Firebase:", error);
    }
  };
  
  useEffect(() => {
    const docRef = doc(db, "notes", "tiptapNotes");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const ids = data.ids || [];
 
        const notesArray = ids.map((id) => ({
          id,
          text: data[id] || "", 
        }));

        setSavedNotes(notesArray); 
      } else {
        setSavedNotes([]);
        console.log("No notes found.");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Pro-Extension TipTap Editor</h1>

       <EditorContent editor={editor} />

       <h2>Saved Notes</h2>
      <ul>
        {savedNotes.map((note, index) => (
          <li key={note.id}>
            <strong>Sequence:</strong> {index + 1} <br />
            <strong>ID:</strong> {note.id} <br />
            <strong>Text:</strong> {note.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
