import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CIcon } from "@coreui/icons-react";
import { cilMicrophone } from "@coreui/icons";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const availableApps = [
    "code", "git-bash", "cmd", "powershell", "postman", "xampp-control",
    "studio64", "idea64", "pycharm64", "jupyter-notebook", "devenv", "chrome",
    "firefox", "msedge", "notion", "obsidian", "winword", "excel", "notepad",
    "calc", "anki", "zoom", "Teams", "slack", "discord", "skype", "spotify",
    "vlc", "FocusToDo"
];
const availableWebsites = [
    'https://www.google.com', 'https://www.yahoo.com', 'https://www.bing.com',
    'https://www.duckduckgo.com', 'https://www.ask.com', 'https://www.baidu.com',
    'https://www.aol.com', 'https://www.yandex.com', 'https://www.wolframalpha.com',
    'https://www.archive.org'
];
const exec = [
    { name: "Visual Studio Code", exec: "code" }, { name: "Git Bash", exec: "git-bash" },
    { name: "Command Prompt", exec: "cmd" }, { name: "PowerShell", exec: "powershell" },
    { name: "Postman", exec: "postman" }, { name: "XAMPP Control Panel", exec: "xampp-control" },
    { name: "Android Studio", exec: "studio64" }, { name: "IntelliJ IDEA", exec: "idea64" },
    { name: "PyCharm", exec: "pycharm64" }, { name: "Jupyter Notebook", exec: "jupyter-notebook" },
    { name: "Visual Studio", exec: "devenv" }, { name: "Google Chrome", exec: "chrome" },
    { name: "Mozilla Firefox", exec: "firefox" }, { name: "Microsoft Edge", exec: "msedge" },
    { name: "Notion", exec: "notion" }, { name: "Obsidian", exec: "obsidian" },
    { name: "Microsoft Word", exec: "winword" }, { name: "Microsoft Excel", exec: "excel" },
    { name: "Notepad", exec: "notepad" }, { name: "Calculator", exec: "calc" },
    { name: "Anki", exec: "anki" }, { name: "Zoom", exec: "zoom" },
    { name: "Microsoft Teams", exec: "Teams" }, { name: "Slack", exec: "slack" },
    { name: "Discord", exec: "discord" }, { name: "Skype", exec: "skype" },
    { name: "Spotify", exec: "spotify" }, { name: "VLC Media Player", exec: "vlc" },
    { name: "Focus To-Do", exec: "FocusToDo" }
];

// const api_url = import.meta.env.VITE_API

function Enroll() {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <div>Speech recognition is not supported in your browser.</div>;
    }

    const [showpopup, setshowpopup] = useState(false);
    const [selectedApps, setSelectedApps] = useState([]);
    const [selectedWebsites, setSelectedWebsites] = useState([]);
    const [searchApp, setSearchApp] = useState('');
    const [searchWebsite, setSearchWebsite] = useState('');
    const [voiceCommand, setVoiceCommand] = useState("");
    const navigate = useNavigate();

    const filteredApps = availableApps.filter((app) => app.toLowerCase().includes(searchApp.toLowerCase()));
    const filteredWebsites = availableWebsites.filter((site) => site.toLowerCase().includes(searchWebsite.toLowerCase()));

    const addApp = (app) => {
        if (!selectedApps.includes(app)) {
            setSelectedApps([...selectedApps, app]);
            setSearchApp('');
        }
    };

    const addWebsite = (site) => {
        if (!selectedWebsites.includes(site)) {
            setSelectedWebsites([...selectedWebsites, site]);
            setSearchWebsite('');
        }
    };

    const removeItem = (item, setItems) => {
        setItems(prev => prev.filter(i => i !== item));
    };

    useEffect(() => {
        setVoiceCommand(transcript.toLowerCase().replace(/[?.;,]+$/g, ""));
    }, [transcript]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/enroll", {
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
            navigate('/Landing');
        } catch (err) {
            console.error("Error occurred during submission:", err);
        } finally {
            setVoiceCommand("");
        }
    };

    const togglepopup = () => {
        setshowpopup(!showpopup);
    }

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <button
                    onClick={togglepopup}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Show Executables
                </button>
            </div>

            {showpopup && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-gray-100 rounded-lg p-6 max-w-md w-full shadow-xl text-gray-800"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-gray-900">Executables List</h2>
                        <ul className="space-y-2 max-h-80 overflow-y-auto text-sm">
                            {exec.map(({ name, exec }) => (
                                <li key={exec} className="border-b border-gray-300 pb-1">
                                    <strong className='text-gray-700'>{name}</strong> → <code className='bg-gray-200 px-1 rounded'>{exec}</code>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={togglepopup}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 w-full"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}

            <div className="flex flex-col md:flex-row w-full max-w-6xl bg-gray-800 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl mt-16 md:mt-0">
                <div className="w-full md:w-1/2 md:pr-6 mb-6 md:mb-0">
                    <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-indigo-400">Apps Enrollment</h2>
                        <input
                            type="text"
                            placeholder="Search for an app..."
                            value={searchApp}
                            onChange={(e) => setSearchApp(e.target.value)}
                            className="w-full p-3 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                        />
                        {searchApp && (
                            <div className="border border-gray-600 p-3 mt-1 bg-gray-800 rounded-md shadow-md max-h-40 overflow-y-auto">
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
                            <ul className="mt-4 space-y-2">
                                <h3 className="font-semibold mb-2 text-indigo-300">Selected Apps:</h3>
                                {selectedApps.map((app, index) => (
                                    <li key={index} className="p-2 flex justify-between items-center bg-gray-600 rounded-md">
                                        <span>{index + 1}. {app}</span>
                                        <button
                                            onClick={() => removeItem(app, setSelectedApps)}
                                            className="text-red-400 hover:text-red-500 transition text-xl font-bold ml-2"
                                            aria-label={`Remove ${app}`}
                                        >
                                            ×
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
                            className="w-full p-3 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                        />
                        {searchWebsite && (
                            <div className="border border-gray-600 p-3 mt-1 bg-gray-800 rounded-md shadow-md max-h-40 overflow-y-auto">
                                {filteredWebsites.length > 0 ? (
                                    filteredWebsites.map((site) => (
                                        <button
                                            key={site}
                                            onClick={() => addWebsite(site)}
                                            className="block w-full text-left p-2 hover:bg-gray-500 transition rounded-md truncate"
                                        >
                                            {site}
                                        </button>
                                    ))
                                ) : (
                                    <button
                                        onClick={() => addWebsite(searchWebsite)}
                                        className="block w-full text-left p-2 bg-green-600 hover:bg-green-700 transition text-white rounded-md"
                                    >
                                        Add "{searchWebsite}"
                                    </button>
                                )}
                            </div>
                        )}
                        {selectedWebsites.length > 0 && (
                            <ul className="mt-4 space-y-2">
                                <h3 className="font-semibold mb-2 text-indigo-300">Selected Websites:</h3>
                                {selectedWebsites.map((site, index) => (
                                    <li key={index} className="p-2 flex justify-between items-center bg-gray-600 rounded-md">
                                        <span className="truncate flex-1 mr-2">{index + 1}. {site}</span>
                                        <button
                                            onClick={() => removeItem(site, setSelectedWebsites)}
                                            className="text-red-400 hover:text-red-500 transition text-xl font-bold ml-2 flex-shrink-0"
                                            aria-label={`Remove ${site}`}
                                        >
                                            X
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="hidden md:block w-1 bg-gray-700 mx-6"></div>

                <div className="w-full md:w-1/2 flex flex-col items-center mt-6 md:mt-0">
                    <p className="text-center text-sm mb-2 text-gray-400">
                        {listening ? 'Listening...' : 'Tap microphone to start'}
                    </p>
                    <motion.button
                        className={`w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                            listening ? 'bg-red-500 hover:bg-red-600 animate-pulse focus:ring-red-400' : 'bg-gray-700 hover:bg-gray-600 focus:ring-indigo-500'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleListening}
                        aria-label={listening ? 'Stop listening' : 'Start listening'}
                    >
                        <CIcon icon={cilMicrophone} size="3xl" className={listening ? 'text-white' : 'text-indigo-300'}/>
                    </motion.button>

                    <div className="mt-8 w-full">
                        <label htmlFor="voiceCommandInput" className="block text-center text-lg mb-2 text-indigo-300">Voice Command</label>
                        <textarea
                            id="voiceCommandInput"
                            className="w-full p-4 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows="4"
                            placeholder="Speak or type your command..."
                            value={voiceCommand}
                            onChange={(e) => {
                                setVoiceCommand(e.target.value);
                            }}
                        />
                        <div className="flex justify-center mt-4">
                             <button
                                onClick={resetTranscript}
                                disabled={!transcript && !voiceCommand}
                                className="px-5 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reset Command
                            </button>
                        </div>
                    </div>

                    <motion.button
                        className="mt-10 px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg text-lg font-semibold"
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(59, 130, 246, 0.5)" }}
                        onClick={handleSubmit}
                        disabled={!voiceCommand.trim()}
                    >
                        Enroll Command
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export default Enroll;
