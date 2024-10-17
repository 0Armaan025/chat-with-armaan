"use client";
import React, { useState } from "react";
import { db } from "../firebaseConfig"; // Import Firestore instance
import { collection, addDoc } from "firebase/firestore";
import Cookies from "js-cookie"; // Import js-cookie

const HomePage = () => {
  const [name, setName] = useState("");

  // Function to handle saving the name in Firestore
  const handleSaveName = async () => {
    if (name.trim()) {
      try {
        // Add the name to Firestore under 'users' collection
        const userRef = await addDoc(collection(db, "users"), {
          name: name,
        });

        // Store user ID and name in cookies for later use
        Cookies.set("userId", userRef.id, { expires: 1 }); // Expires in 1 day
        Cookies.set("userName", name, { expires: 1 });

        // Navigate to the discuss page
        window.location.href = "/discuss";
      } catch (error) {
        console.error("Error adding user: ", error);
      }
    }
  };

  return (
    <div className="homePage">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <center>
          <label
            style={{
              fontFamily: "Poppins",
              marginTop: "8rem",
              fontSize: "2rem",
            }}
          >
            Chat With Armaan, IX-E
          </label>
          <div
            className="formDiv"
            style={{
              background: "#e6e3e3",
              padding: "12px",
              width: "20rem",
              height: "10rem",
              borderRadius: "4px",
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label
              style={{
                fontSize: "22px",
                margin: "4px",
                fontWeight: "bold",
                fontFamily: "Poppins",
              }}
            >
              Enter your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: "18rem",
                margin: "4px",
                fontFamily: "Poppins",
                borderRadius: "4px",
                padding: "7px",
              }}
            />
            <input
              type="button"
              value="Start discussing"
              onClick={handleSaveName}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                background: "#f71616",
                color: "white",
                cursor: "pointer",
                fontFamily: "Poppins",
                marginTop: "6px",
              }}
            />
          </div>
        </center>
      </div>
    </div>
  );
};

export default HomePage;
