import React from 'react';
import { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CIcon } from "@coreui/icons-react";
import { cilMicrophone } from "@coreui/icons";
import SpeechRecognition , { useSpeechRecognition } from 'react-speech-recognition';


const availableApps = [ 
    "code", "git-bash", "cmd", "powershell", "postman", "xampp-control",
    "studio64", "idea64", "pycharm64", "jupyter-notebook", "devenv", "chrome",
    "firefox", "msedge", "notion", "obsidian", "winword", "excel", "notepad",
    "calc", "anki", "zoom", "Teams", "slack", "discord", "skype", "spotify",
    "vlc", "FocusToDo"
  ];
const availableWebsites = [
    'https://www.google.com',
    'https://www.yahoo.com',
    'https://www.bing.com',
    'https://www.duckduckgo.com',
    'https://www.ask.com',
    'https://www.baidu.com',
    'https://www.aol.com',
    'https://www.yandex.com',
    'https://www.wolframalpha.com',
    'https://www.archive.org'
];

const exec = [
    { name: "Visual Studio Code", exec: "code" },
    { name: "Git Bash", exec: "git-bash" },
    { name: "Command Prompt", exec: "cmd" },
    { name: "PowerShell", exec: "powershell" },
    { name: "Postman", exec: "postman" },
    { name: "XAMPP Control Panel", exec: "xampp-control" },
    { name: "Android Studio", exec: "studio64" },
    { name: "IntelliJ IDEA", exec: "idea64" },
    { name: "PyCharm", exec: "pycharm64" },
    { name: "Jupyter Notebook", exec: "jupyter-notebook" },
    { name: "Visual Studio", exec: "devenv" },
    { name: "Google Chrome", exec: "chrome" },
    { name: "Mozilla Firefox", exec: "firefox" },
    { name: "Microsoft Edge", exec: "msedge" },
    { name: "Notion", exec: "notion" },
    { name: "Obsidian", exec: "obsidian" },
    { name: "Microsoft Word", exec: "winword" },
    { name: "Microsoft Excel", exec: "excel" },
    { name: "Notepad", exec: "notepad" },
    { name: "Calculator", exec: "calc" },
    { name: "Anki", exec: "anki" },
    { name: "Zoom", exec: "zoom" },
    { name: "Microsoft Teams", exec: "Teams" },
    { name: "Slack", exec: "slack" },
    { name: "Discord", exec: "discord" },
    { name: "Skype", exec: "skype" },
    { name: "Spotify", exec: "spotify" },
    { name: "VLC Media Player", exec: "vlc" },
    { name: "Focus To-Do", exec: "FocusToDo" }
];

function Enroll() {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();


    if(!browserSupportsSpeechRecognition){
        return <div>Speech recognition is not supported in your browser.</div>;
    }

    const [showpopup,setshowpopup] = useState(false);
    const [selectedApps, setSelectedApps] = useState([]);
    const [selectedWebsites, setSelectedWebsites] = useState([]);
    const [searchApp, setSearchApp] = useState('');
    const [searchWebsite, setSearchWebsite] = useState('');
    const [Listening,setListening] = useState(false);
    const [voiceCommand, setVoiceCommand] = useState("");
    const navigate = useNavigate();

    const filteredApps = availableApps.filter((app) => app.toLowerCase().includes(searchApp.toLowerCase()));
    const filteredWebsites = availableWebsites.filter((site) => site.toLowerCase().includes(searchWebsite.toLowerCase()));

    const addApp = (app) => {
        if (!selectedApps.includes(app)) {
            setSelectedApps([...selectedApps, app]);
            setSearchApp(''); // Clear search after selection
        }
    };

    const addWebsite = (site) => {
        if (!selectedWebsites.includes(site)) {
            setSelectedWebsites([...selectedWebsites, site]);
            setSearchWebsite(''); // Clear search after selection
        }
    };

    const removeItem = (item, setItems) => {
        setItems(prev => prev.filter(i => i !== item));
    };

    const handleVoiceActivation = () => {
        setListening(true);
        setTimeout(() => {
            setVoiceCommand("Open Chrome and visit YouTube"); // Simulated voice input
            setListening(false);
        }, 2000);
    };
    
    useEffect(()=>{
        setVoiceCommand(transcript.toLowerCase().replace(/[?.;,]+$/g, ""));
    })
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apps: selectedApps,
                    websites: selectedWebsites,
                    command: voiceCommand,
                }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Enrollment successful:", data);
            } else {
                console.error("Enrollment failed:", data.message);
            }
            navigate('/Landing')
        } catch (err) {
            console.log("Error occurred", err);
        }
    };

    const togglepopup =()=>{
        setshowpopup(!showpopup);
    }
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <button
                    onClick={togglepopup}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Show Executables
                </button>
            </div>

            {showpopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Executables List</h2>
                        <ul className="space-y-2 max-h-80 overflow-y-auto">
                            {exec.map(({ name, exec }) => (
                                <li key={exec} className="text-gray-800">
                                    <strong>{name}</strong> &rarr; <code>{exec}</code>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={togglepopup}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <div className="flex w-full max-w-5xl bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <div className="w-1/2 pr-6">
                    <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-indigo-400">Apps Enrollment</h2>
                        <input
                            type="text"
                            placeholder="Search for an app..."
                            value={searchApp}
                            onChange={(e) => setSearchApp(e.target.value)}
                            className="w-full p-3 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {searchApp && (
                            <div className="border p-3 mt-3 bg-gray-800 rounded-md shadow-md">
                                {filteredApps.length > 0 ? (
                                    filteredApps.map((app) => (
                                        <button
                                            key={app}
                                            onClick={() => addApp(app)}
                                            className="block w-full text-left p-2 hover:bg-gray-500 transition rounded-md"
                                        >
                                            {app}
                                        </button>
                                    ))
                                ) : (
                                    <p className="p-2 text-gray-400">No results found</p>
                                )}
                            </div>
                        )}
                        {selectedApps.length > 0 && (
                            <ul className="mt-4">
                                <h3 className="font-semibold mb-2 text-indigo-300">Selected Apps:</h3>
                                {selectedApps.map((app, index) => (
                                    <li key={index} className="p-2 flex justify-between bg-gray-600 rounded-md mb-2">
                                        {index + 1}. {app}
                                        <button
                                            onClick={() => removeItem(app, setSelectedApps)}
                                            className="text-red-500 hover:text-red-600 transition"
                                        >
                                            ✖
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-indigo-400">Website Enrollment</h2>
                        <input
                            type="text"
                            placeholder="Enter or search for a website..."
                            value={searchWebsite}
                            onChange={(e) => setSearchWebsite(e.target.value)}
                            className="w-full p-3 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {searchWebsite && (
                            <div className="border p-3 mt-3 bg-gray-800 rounded-md shadow-md">
                                {filteredWebsites.length > 0 ? (
                                    filteredWebsites.map((site) => (
                                        <button
                                            key={site}
                                            onClick={() => addWebsite(site)}
                                            className="block w-full text-left p-2 hover:bg-gray-500 transition rounded-md"
                                        >
                                            {site}
                                        </button>
                                    ))
                                ) : (
                                    <button
                                        onClick={() => addWebsite(searchWebsite)}
                                        className="block w-full text-left p-2 bg-green-500 hover:bg-green-600 transition text-white rounded-md"
                                    >
                                        Add "{searchWebsite}" as a new website
                                    </button>
                                )}
                            </div>
                        )}
                        {selectedWebsites.length > 0 && (
                            <ul className="mt-4">
                                <h3 className="font-semibold mb-2 text-indigo-300">Selected Websites:</h3>
                                {selectedWebsites.map((site, index) => (
                                    <li key={index} className="p-2 flex justify-between bg-gray-600 rounded-md mb-2">
                                        {index + 1}. {site}
                                        <button
                                            onClick={() => removeItem(site, setSelectedWebsites)}
                                            className="text-red-500 hover:text-red-600 transition"
                                        >
                                            ✖
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="w-1 bg-gray-700 mx-6"></div>
                <div className="w-1/2 flex flex-col items-center">
                    <motion.div
                        className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={SpeechRecognition.startListening}
                    >
                        <CIcon icon={cilMicrophone} size="3xl" />
                    </motion.div>
                    <div className="mt-8 w-full">
                        <p className="text-center text-lg mb-4 text-indigo-300">Voice Command</p>
                        <textarea
                            className="w-full p-4 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows="3"
                            value={voiceCommand}
                            onChange={(ev) => {
                                setVoiceCommand(ev.target.value);
                            }}
                        />
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={SpeechRecognition.stopListening}
                                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition shadow-md"
                            >
                                Stop
                            </button>
                            <button
                                onClick={resetTranscript}
                                className="ml-4 px-4 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition shadow-md"
                            >
                                {listening ? "Stop Listening" : "Start Listening"}
                            </button>
                            <button
                                onClick={resetTranscript}
                                className="ml-4 px-4 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition shadow-md"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                    <motion.button
                        className="mt-8 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        onClick={handleSubmit}
                    >
                        Submit & Redirect
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export default Enroll;
