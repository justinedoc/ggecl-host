import {
    FaMicrophoneSlash,
    FaVideo,
    FaUsers,
    FaCommentDots,
    // FaDesktop,
    FaSmile,
    FaPhoneAlt,
    FaTimes,
  } from "react-icons/fa";
  import { useState } from "react";
  import signupImg from "@/assets/images/signup-img.png";
  
  interface Participant {
    name: string;
    muted: boolean;
    videoOn: boolean;
    img: string;
  }
  
  const participants: Participant[] = [
    { name: "Merry", muted: true, videoOn: true, img: signupImg },
    { name: "John", muted: true, videoOn: false, img: signupImg },
    { name: "Anna", muted: true, videoOn: true, img: signupImg },
    { name: "Victor", muted: false, videoOn: true, img: signupImg },
    { name: "Sara", muted: false, videoOn: true, img: signupImg },
  ];
  
  const VideoCall: React.FC = () => {
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const [videoOn, setVideoOn] = useState<boolean>(true);
    const [chatOpen, setChatOpen] = useState<boolean>(false);
    const [participantsOpen, setParticipantsOpen] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Participant | null>(null);
    const [inCall, setInCall] = useState<boolean>(false);
    const [feedbackPage, setFeedbackPage] = useState<boolean>(false);
  
    const handleJoinCall = () => setInCall(true);
    const handleLeaveCall = () => {
      setInCall(false);
      setFeedbackPage(true);
    };
  
    const handleStudentClick = (student: Participant) => setSelectedStudent(student);
  
    // const reactions = ["👍", "❤️", "😂", "👏", "🎉"];
  
    if (feedbackPage) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            How was the call?
          </h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => setInCall(false)}>
              Go Back
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={() => window.location.href = "/"}>
              Go Home
            </button>
          </div>
        </div>
      );
    }
  
    if (!inCall) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
          <img src={signupImg} alt="Course" className="w-40 h-40 rounded-md mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Digital Marketing Fundamentals
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Instructor: Sun The Sign</p>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`px-4 py-2 rounded-md ${isMuted ? "bg-red-500 text-white" : "bg-gray-300 text-gray-800"}`}
            >
              {isMuted ? "Unmute Mic" : "Mute Mic"}
            </button>
            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`px-4 py-2 rounded-md ${videoOn ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800"}`}
            >
              {videoOn ? "Stop Video" : "Start Video"}
            </button>
          </div>
          <button
            onClick={handleJoinCall}
            className="px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            Join Now
          </button>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Digital Marketing Fundamentals
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sun The Sign • Marketing instructor</p>
          </div>
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <span>51m</span>
            <span className="flex items-center text-yellow-500 gap-1">
              <FaSmile /> 4.8
            </span>
          </div>
        </div>
  
        {/* Participant Thumbnails */}
        <div className="overflow-x-auto flex gap-3 p-4 border-b dark:border-gray-700">
          {participants.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleStudentClick(p)}
            >
              <img src={p.img} alt={p.name} className="w-20 h-20 rounded-md object-cover" />
              <span className="text-xs text-gray-700 dark:text-gray-300">{p.name}</span>
              {p.muted && <FaMicrophoneSlash className="text-red-500 text-xs" />}
            </div>
          ))}
        </div>
  
        {/* Main Video */}
        <div className="flex-grow flex items-center justify-center bg-gray-950 relative">
          {videoOn ? (
            <video
              className="w-full h-full object-contain max-h-[300px]"
              autoPlay
              muted={isMuted}
            ></video>
          ) : (
            <img
              src={signupImg}
              alt="Main speaker"
              className="w-full h-full object-contain max-h-[300px]"
            />
          )}
          <span className="absolute bottom-2 left-2 text-white bg-gray-800 px-2 py-1 text-xs rounded">
            Sara
          </span>
        </div>
  
        {/* Chat Sidebar */}
        {chatOpen && (
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gray-100 dark:bg-gray-800 p-4 border-l dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Chat</h3>
              <button onClick={() => setChatOpen(false)}>
                <FaTimes className="text-gray-500 dark:text-gray-300" />
              </button>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto h-[80%]">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>John:</strong> Hello everyone!
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Sara:</strong> Hi John!
              </div>
            </div>
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full mt-4 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
  
        {/* Student Info Modal */}
        {selectedStudent && (
          <div className="absolute inset-0 bg-transparent blur(20) place-items-center bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
              <img src={selectedStudent.img} alt={selectedStudent.name} className="w-20 h-20 rounded-md mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{selectedStudent.name}</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedStudent({ ...selectedStudent, muted: !selectedStudent.muted })}
                  className={`px-4 py-2 rounded-md ${selectedStudent.muted ? "bg-red-500 text-white" : "bg-gray-300 text-gray-800"}`}
                >
                  {selectedStudent.muted ? "Unmute" : "Mute"}
                </button>
                <button
                  onClick={() => setSelectedStudent({ ...selectedStudent, videoOn: !selectedStudent.videoOn })}
                  className={`px-4 py-2 rounded-md ${selectedStudent.videoOn ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800"}`}
                >
                  {selectedStudent.videoOn ? "Stop Video" : "Start Video"}
                </button>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
  
        {/* Bottom Controls */}
        <div className="flex justify-between items-center p-4 border-t dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          <div className="flex gap-4 text-gray-700 dark:text-gray-200">
            <button onClick={() => setIsMuted(!isMuted)} className="flex flex-col items-center text-sm">
              <FaMicrophoneSlash className={isMuted ? "text-red-500" : ""} size={20} />
              <span>{isMuted ? "Unmute" : "Mute"}</span>
            </button>
            <button onClick={() => setVideoOn(!videoOn)} className="flex flex-col items-center text-sm">
              <FaVideo className={!videoOn ? "text-red-500" : ""} size={20} />
              <span>{videoOn ? "Stop Video" : "Start Video"}</span>
            </button>
            <button onClick={() => setChatOpen(!chatOpen)} className="flex flex-col items-center text-sm">
              <FaCommentDots size={20} />
              <span>Chat</span>
            </button>
            <button onClick={() => setParticipantsOpen(!participantsOpen)} className="flex flex-col items-center text-sm">
              <FaUsers size={20} />
              <span>Participants</span>
            </button>
            <button className="flex flex-col items-center text-sm">
              <FaSmile size={20} />
              <span>Reactions</span>
            </button>
          </div>
          <button onClick={handleLeaveCall} className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <FaPhoneAlt /> Leave
          </button>
        </div>
  
        {/* Participants Sidebar */}
        {participantsOpen && (
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gray-100 dark:bg-gray-800 p-4 border-l dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Participants</h3>
              <button onClick={() => setParticipantsOpen(false)}>
                <FaTimes className="text-gray-500 dark:text-gray-300" />
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {participants.map((p) => (
                <li key={p.name} className="text-sm text-gray-700 dark:text-gray-300">
                  {p.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  export default VideoCall;