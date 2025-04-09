import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// const api_url = import.meta.env.VITE_API

const Mic = () => {
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <div className="text-red-500 text-center p-4">Speech recognition is not supported in your browser.</div>;
  }

  const handleMicToggle = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false });
      setIsListening(true);
    }
  };

  useEffect(() => {
    setInputValue(transcript.trim().toLowerCase().replace(/[?.;,]+$/g, ""));
  }, [transcript]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/getlaunch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: inputValue }),
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log("Enrollment successful:", data);
      } else {
        console.error("Enrollment failed:", data.message);
      }
      setInputValue("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-8 rounded-2xl shadow-lg bg-gradient-to-br from-gray-300 to-gray-500 text-black">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Voice Command Launcher</h1>
        <p className="text-gray-600">Speak or type a command to interact</p>
      </div>
      
      <div className="flex flex-col items-center mb-6">
        <button
          type="button"
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 shadow-md hover:scale-105 focus:outline-none ${
            isListening 
              ? "bg-red-500 animate-pulse shadow-red-300" 
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-300"
          }`}
          onClick={handleMicToggle}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        <p className="mt-3 font-semibold text-gray-600">
          {listening ? "Listening..." : "Not listening"}
        </p>
      </div>
      
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
          placeholder="Speak or type here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-700">
          <span className="font-medium">Transcript:</span> {transcript.toLowerCase().replace(/[?.;,]+$/g, "")}
        </p>
      </div>
    </div>
  );
};

export default Mic;