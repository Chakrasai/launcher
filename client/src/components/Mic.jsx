import React, { useState, useEffect } from "react";
import "./mic.css";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Mic = () => {
  const [Listening, setListening] = useState(false);
  const [inputValue, setInputValue] = useState(""); // State for the input field
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <div>Speech recognition is not supported in your browser.</div>;
  }

  const handleMicToggle = () => {
    if (Listening) {
      SpeechRecognition.stopListening();
      setListening(false);
    } else {
      resetTranscript(); // Clear previous transcript
      SpeechRecognition.startListening({ continuous: false }); // Listen for a single input
      setListening(true);
    }
  };

  // Sync the transcript with the input field
  useEffect(() => {
    setInputValue(transcript.trim().toLowerCase().replace(/[?.;,]+$/g, ""));
  }, [transcript]);

  const handleSubmit = async (ev) => {
    ev.preventDefault(); 
    try{
      const response = await fetch('http://localhost:3000/getlaunch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command : inputValue }),
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
          console.log("Enrollment successful:", data);
      } else {
          console.error("Enrollment failed:", data.message);
      }
      setInputValue(""); 
    }
    catch(err){
      console.log(err);
    }
  };

  return (
    <div className="container">
      <button
        type="button"
        className={`mic ${Listening ? "listening" : ""}`}
        onClick={handleMicToggle}
      >
        <i className="fa fa-microphone">mic</i>
      </button>
      <div>
        <input
          type="text"
          className="mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Speak or type here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} 
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <p>{listening ? "Listening..." : "Not listening"}</p>
      <p>Transcript: {transcript.toLowerCase().replace(/[?.;,]+$/g, "")}</p> 
    </div>
  );
};

export default Mic;
