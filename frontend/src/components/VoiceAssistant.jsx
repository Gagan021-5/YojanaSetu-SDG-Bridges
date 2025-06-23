import { useState, useRef } from "react";
import { Mic, X } from "lucide-react";

const VoiceAssistant = ({ onClose, onCommand, language = "en" }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const translations = {
    en: {
      title: "Voice Assistant",
      listening: "Listening...",
      processing: "Processing...",
      micDenied: "Microphone access denied",
      error: "Error: Processing failed",
      networkError: "Network error",
      trySaying: "Try saying:",
      suggestions: [
        "Schemes for farmers",
        "Women empowerment programs",
        "Health insurance schemes",
      ],
    },
    hi: {
      title: "आवाज़ सहायक",
      listening: "सुन रहा है...",
      processing: "प्रसंस्करण हो रहा है...",
      micDenied: "माइक्रोफ़ोन पहुँच अस्वीकृत",
      error: "त्रुटि: प्रसंस्करण विफल",
      networkError: "नेटवर्क त्रुटि",
      trySaying: "कहने का प्रयास करें:",
      suggestions: [
        "किसानों के लिए योजनाएँ",
        "महिला सशक्तिकरण कार्यक्रम",
        "स्वास्थ्य बीमा योजनाएँ",
      ],
    },
  };

  const t = translations[language];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        console.log("Data available, size:", e.data.size); // Debug chunk size
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = sendAudioToBackend;

      mediaRecorderRef.current.start();
      console.log("Recording started");
      setIsListening(true);
      setTranscript(t.listening);
    } catch (err) {
      console.error("Microphone access error:", err.message);
      setTranscript(t.micDenied);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
      mediaRecorderRef.current?.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsListening(false);
    }
  };

  const sendAudioToBackend = async () => {
    setIsProcessing(true);
    setTranscript(t.processing);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      console.log("Audio blob size:", audioBlob.size); // Debug blob size
      if (audioBlob.size === 0) {
        throw new Error("Empty audio recording");
      }

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", language);

      const response = await fetch("http://localhost:3000/api/whisper", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();

      if (data.transcript) {
        setTranscript(data.transcript);
        onCommand(data.transcript);
      } else {
        setTranscript(t.error + (data.error ? `: ${data.error}` : ""));
      }
    } catch (err) {
      console.error("API request failed:", err.message);
      setTranscript(`${t.networkError}: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{t.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <button
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`p-4 rounded-full transition-colors ${
              isListening
                ? "bg-red-500 animate-pulse"
                : isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            <Mic className="w-6 h-6" />
          </button>
          <p className="mt-4 text-gray-600 text-center text-sm">{transcript}</p>
          {(transcript.startsWith(t.error) || transcript.startsWith(t.networkError)) && (
            <button
              onClick={toggleRecording}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              Retry
            </button>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 font-medium mb-2">{t.trySaying}</p>
          <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
            {t.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;