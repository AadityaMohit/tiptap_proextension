import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UniqueID from "@tiptap-pro/extension-unique-id";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

 const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

function App() {
  const [savedNotes, setSavedNotes] = useState([]);
  const [editorContent, setEditorContent] = useState("");   

 
  const saveContentToFirebase = async (content) => {
    try {
      const docRef = doc(db, "notes", "tiptapNotes");

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

 
  const saveContentDebounced = debounce(saveContentToFirebase, 500);
 
  const editor = useEditor({
    extensions: [
      StarterKit,
      UniqueID.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getJSON().content;
      const elements = updatedContent
        ?.filter((node) => node.type === "paragraph" || node.type === "heading")
        .map((node) => ({
          id: node.attrs?.id || "",
          text: node.content?.map((textNode) => textNode.text).join(" ") || "",
        }));

      if (elements && elements.length > 0) {
        saveContentDebounced(elements);
      }
 
      setEditorContent(editor.getJSON().content);
    },
  });
 
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

  useEffect(() => {
    if (editor && savedNotes.length > 0) {
      const newContent = savedNotes.map((note) => ({
        type: "paragraph",
        attrs: { id: note.id },
        content: [
          {
            type: "text",
            text: note.text,
          },
        ],
      }));
  
      // Extract the IDs currently in the editor
      const currentContent = editor.getJSON().content || [];
      const currentIds = new Set(
        currentContent.map((item) => item.attrs?.id).filter((id) => id)
      );
  
      // Check for differences and only insert new content
      newContent.forEach((note) => {
        if (!currentIds.has(note.attrs.id)) {
          editor.commands.insertContentAt(0, note);
        }
      });
    }
  }, [savedNotes, editor]);
  
  return (
    <div>
      <h1>Pro-Extension TipTap Editor</h1>
      <EditorContent editor={editor} />
 
    </div>
  );
}

export default App;
