import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UniqueID from "@tiptap-pro/extension-unique-id";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAK3UIwUUwLLCGswz9lO90ICDviXmkOD2I",
  authDomain: "testextension-1e32b.firebaseapp.com",
  projectId: "testextension-1e32b",
  storageBucket: "testextension-1e32b.appspot.com",
  messagingSenderId: "736473904434",
  appId: "1:736473904434:web:77259b6327747127b9d32b",
  measurementId: "G-ZY1EZREYB3",
}
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
function App() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UniqueID.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: '',
  });

  const saveToFirestore = async () => {
    if (!editor) return;

    const json = editor.getJSON();

    for (const node of json.content) {
      if (node.type === "paragraph" || node.type === "heading") {
        const docId = node.attrs?.id;
        if (docId) {
          const contentText = node.content?.map((c) => c.text).join(" ") || "";
          await setDoc(doc(db, "proextension", docId), {
            type: node.type,
            content: contentText,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!editor) return;

    const saveInterval = setInterval(saveToFirestore, 3000);
    return () => clearInterval(saveInterval);
  }, [editor]);

  // const renderContentWithIds = () => {
  //   if (!editor) return null;

  //   const json = editor.getJSON();

  //   return json.content.map((node, index) => {
  //     if (node.type === "paragraph" || node.type === "heading") {
  //       return (
  //         <div key={index}>
  //           <strong>{node.type} ID:</strong> {node.attrs?.id || "No ID"}
  //           <div>{node.content?.map((c) => c.text).join(" ")}</div>
  //         </div>
  //       );
  //     }
  //     return null;
  //   });
  // };
  return (
    <>
      <h1>Pro-Extension tiptap editor</h1>
      <EditorContent editor={editor} />
       
    </>
  );
}
export default App;
