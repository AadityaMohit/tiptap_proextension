import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UniqueID from "@tiptap-pro/extension-unique-id";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAK3UIwUUwLLCGswz9lO90ICDviXmkOD2I",
  authDomain: "testextension-1e32b.firebaseapp.com",
  projectId: "testextension-1e32b",
  storageBucket: "testextension-1e32b.appspot.com",
  messagingSenderId: "736473904434",
  appId: "1:736473904434:web:77259b6327747127b9d32b",
  measurementId: "G-ZY1EZREYB3",
};

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
    content: "",
    onTransaction: ({ editor, transaction })=> {
     console.log("Transaction is ",transaction.doc.content.toJSON());

const TransactionJson=transaction.doc.content.toJSON()
console.log(TransactionJson);
// TransactionJson.forEach((transactionItem, index) => {
//   const Tid = transactionItem.attrs?.id;
//   console.log(`ID ${index}: `, Tid);

//   const Ttext = transactionItem.content?.[0]?.text;
//   console.log(`Text ${index}: `, Ttext);
// });

     
    },
    onUpdate: ({ editor }) => {
       
     

      const updatedContent = editor.getJSON().content;

      const elements = updatedContent
        ?.filter(node => node.type === "paragraph" || node.type === "heading")
        .map(node => ({
          id: node.attrs?.id || "",
          type: node.type,
          text: node.content?.map(textNode => textNode.text).join(" ") || "",
        }));

      if (elements && elements.length > 0) {
        saveContentToFirebase(elements);
      }
    },
  });
  const saveContentToFirebase = async (content) => {
    try {
      const docRef = doc(db, "notes", "tiptapNotes");
  
 
      
   
      console.log("Content saved successfully!");
    } catch (error) {
      console.error("Error saving content to Firebase:", error);
    }
  };
  
  
  
  

  return (
    <>
      <h1>Pro-Extension TipTap Editor</h1>
      <EditorContent editor={editor} />
    </>
  );
}

export default App;