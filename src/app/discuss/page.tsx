"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // Import Firestore instance
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Cookies from "js-cookie";

const DiscussPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userName = Cookies.get("userName"); // Retrieve name from cookies

  // Function to fetch messages from Firestore in real-time
  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("time", "asc"));

    // Real-time listener for Firestore messages
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = querySnapshot.docs.map((doc) => doc.data()) as any;
      setMessages(messagesArray);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  // Function to send a message and store it in Firestore
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const newMsg = {
        name: userName,
        message: newMessage,
        time: new Date().toISOString(), // Use ISO string for consistent time
      };

      try {
        // Add the new message to Firestore
        await addDoc(collection(db, "messages"), newMsg);
        setNewMessage(""); // Clear the input field after sending
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSendMessage(); // Send message on Enter key press
    }
  };

  return (
    <div className="discussPage flex flex-col justify-between items-start h-screen">
      {/* Top Navigation */}
      <div className="top-nav flex flex-row justify-start items-center bg-[#749422] w-full h-12">
        <h3 className="ml-4 text-white" style={{ fontFamily: "Poppins" }}>
          Discuss with Armaan
        </h3>
      </div>

      {/* Chat Area */}
      <div className="chat-area flex-grow overflow-y-auto p-4 w-full">
        {messages.map((msg: any, index: any) => (
          <div
            key={index}
            className={`message mb-4 ${
              msg.name === userName ? "self-end text-right" : ""
            }`}
          >
            <p className="text-sm text-gray-600">
              {msg.name} •{" "}
              {new Date(msg.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div
              className={`${
                msg.name === userName
                  ? "bg-[#749422] text-white ml-auto"
                  : "bg-gray-200 text-black"
              } p-2 rounded-md w-fit`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Message Bar */}
      <div className="message-bar w-full flex items-center px-4 py-2 bg-white border-t border-gray-300">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress} // Handle key press
          className="flex-grow border-0 focus:ring-0 outline-none"
          style={{ fontFamily: "Poppins" }}
        />
        <button className="ml-2" onClick={handleSendMessage}>
          {/* Send button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-[#749422]"
          >
            <path d="M2.293 2.293a1 1 0 011.414 0l18 18a1 1 0 01-1.414 1.414l-18-18a1 1 0 010-1.414zM19.707 3.293a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L21 5.414 18.293 8.12a1 1 0 01-1.414-1.414l3-3zM11.293 11.293a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DiscussPage;
