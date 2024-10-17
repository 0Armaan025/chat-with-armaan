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
            <path
              fillRule="evenodd"
              d="M2.293 2.293a1 1 0 011.32-.083l.094.083 18 18a1 1 0 01-1.32 1.497l-.094-.083-18-18a1 1 0 01.083-1.32l.094-.083zM4 16.414l12.25-6.875a.75.75 0 01.982 1.124L5.518 17.538 4 16.414zm0-2.828l7.25-4.063a.75.75 0 01.982 1.124L5.518 14.71 4 13.586z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M20.25 3.25a.75.75 0 01.75.75v16a.75.75 0 01-1.323.522l-18-18A.75.75 0 013.75 2.5h16a.75.75 0 01.75.75zM19.5 4.5h-14.94L15.018 9.43 19.5 4.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DiscussPage;
