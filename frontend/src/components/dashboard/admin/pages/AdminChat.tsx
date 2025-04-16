import { useState, useEffect } from "react";
import { FaPaperPlane, FaBars, FaTimes } from "react-icons/fa";
import io from "socket.io-client";

// Define types
interface User {
  name: string;
  message: string;
  time: string;
  active: boolean;
}

interface Message {
  text: string;
  sender: "You" | string;
}

const users: User[] = [
  {
    name: "Physics Group",
    message: "Yeah sure, tell me zafor",
    time: "just now",
    active: true,
  },
  {
    name: "Biology Group",
    message: "Thank you so much, sir",
    time: "2 m",
    active: false,
  },
  {
    name: "Art and Craft Group",
    message: "You're Welcome",
    time: "4 m",
    active: false,
  },
  {
    name: "Mathematics Group",
    message: "Thank you so much, sir",
    time: "1 m",
    active: false,
  },
  {
    name: "Chemistry Group",
    message: "Sorry, I can't help you",
    time: "3 m",
    active: false,
  },
  {
    name: "English Group",
    message: "Thank you so much, sir",
    time: "6 m",
    active: false,
  },
];

const socket = io("http://localhost:4000"); // Update with your server URL

const AdminChat = () => {
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello and thanks for signing up...", sender: "Jane" },
    { text: "Hello, Good Evening.", sender: "You" },
    { text: "I'm Zafor", sender: "You" },
    { text: "I only have a small doubt...", sender: "You" },
    { text: "Yeah sure, tell me zafor", sender: "Jane" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groupList, setGroupList] = useState<any[]>(users);

  // Listen for new messages from the server
  useEffect(() => {
    socket.on("message", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  // Handle sending messages
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: Message = { text: newMessage, sender: "You" };
    setMessages([...messages, msg]);

    socket.emit(
      "sendMessage",
      selectedUser.name, // groupId
      "admin-id", // senderId (should come from your actual admin state)
      "admin", // role
      newMessage, // message
      null,
    );

    setNewMessage("");
  };

  useEffect(() => {
    console.log("Connecting to socket server...");

    // Also listen for when a new group is created
    socket.on("groupCreated", (data) => {
      console.log("New group created:", data);

      setGroupList((prev) => [
        ...prev,
        {
          id: data.groupId,
          name: data.groupName,
          admin: data.adminId,
          message: `You created ${data.groupName}`,
          time: "just now",
          students: data.students,
        },
      ]);
    });

    return () => {
      socket.off("initialGroups");
      socket.off("groupCreated");
    };
  }, [socket]);

  useEffect(() => {
    // Handler function
    const handleMessage = (data: any) => {
      console.log("📥 Incoming message:", data);
      // You can update your state here to display it in the UI
      // setMessages((prev) => [...prev, data]);
    };

    // Listen for the message
    socket.on("message", handleMessage);

    // Cleanup to prevent duplicates
    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const handleAddGroup = () => {
    console.log("Add new group clicked");

    const groupDetails = {
      groupName: "New Group",
      groupId: "new-group-id",
      adminId: "admin-id",
      students: ["student1", "student2"],
    };

    socket.emit("createGroup", groupDetails, (response: any) => {
      if (response.success) {
        console.log("Group created successfully:", response.groupId);
      } else {
        console.error("Error creating group:", response.error);
      }
    });
  };
  return (
    <div className="flex h-screen text-gray-600">
      {/* Sidebar */}
      <div
        className={`fixed h-full w-64 border-r border-gray-50 bg-white p-4 shadow-md transition-transform duration-300 ease-in-out md:static md:w-1/3 dark:border-gray-950 dark:bg-gray-900 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="mb-4 flex items-center justify-between text-2xl font-bold">
          Messages
          <button
            className="text-xl md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </h2>
        <input
          type="text"
          placeholder="Search"
          className="mb-4 w-full rounded-md border p-2"
        />
        <button
          onClick={handleAddGroup}
          className="mb-4 w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Create Group
        </button>
        <div className="h-96 space-y-2 overflow-y-auto">
          {groupList.map((user, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedUser(user);
                setSidebarOpen(false);
              }}
              className={`flex cursor-pointer items-center rounded-md p-3 transition-all duration-200 hover:bg-blue-100 ${selectedUser.name === user.name ? "bg-blue-200" : ""}`}
            >
              <div className="h-10 w-10 rounded-full bg-gray-800"></div>
              <div className="ml-3">
                <p className="font-semibold">{user.name}</p>
                <p className="w-40 truncate text-sm text-gray-500">
                  {user.message}
                </p>
              </div>
              <span className="ml-auto text-sm text-gray-400">{user.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center border-b border-gray-200 p-4 shadow-md dark:border-gray-900">
          <button
            className="mr-3 text-xl md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <div className="h-12 w-12 rounded-full bg-gray-800"></div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
            <p
              className={`text-sm ${selectedUser.active ? "text-green-500" : "text-gray-400"}`}
            >
              {selectedUser.active ? "Active Now" : "Offline"}
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto bg-gray-100 p-6 dark:bg-gray-800">
          <div className="mb-4 flex justify-center">
            <span className="rounded-full bg-white px-3 py-1 text-sm text-gray-500 dark:bg-gray-900">
              Today
            </span>
          </div>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${msg.sender === "You" ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 dark:border-gray-950 dark:text-gray-400"}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex border-t border-gray-200 p-4 shadow-md dark:border-gray-900">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 rounded-md border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="ml-2 rounded-md bg-blue-600 p-3 text-white transition-all duration-200 hover:bg-blue-700"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
