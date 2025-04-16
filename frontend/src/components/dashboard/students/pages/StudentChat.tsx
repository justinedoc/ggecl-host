import { isAdmin } from "@/utils/isAdmin";
import { useState } from "react";
import { FaPaperPlane, FaBars, FaTimes } from "react-icons/fa";

interface Message {
  text: string;
  sender: string;
}

interface Group {
  id: string;
  name: string;
  users: string[]; // userIds
  messages: Message[];
}

const mockGroups: Group[] = [
  {
    id: "group1",
    name: "React Learners",
    users: ["student1", "student2", "admin1"],
    messages: [
      { text: "Welcome to the group!", sender: "admin1" },
      { text: "Thanks!", sender: "student1" },
    ],
  },
  {
    id: "group2",
    name: "Next.js Pros",
    users: ["student2", "admin1"],
    messages: [{ text: "Any Next.js users here?", sender: "admin1" }],
  },
  {
    id: "group3",
    name: "Python Devs",
    users: ["admin1"],
    messages: [],
  },
];

const StudentChat = () => {
  const currentUserId = "student2"; // change this to "admin1" to test admin view
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(
    mockGroups.find((group) => group.users.includes(currentUserId)) || null,
  );
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleGroups = groups.filter((group) =>
    group.users.includes(currentUserId),
  );

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;
    const updatedGroups = groups.map((group) =>
      group.id === selectedGroup.id
        ? {
            ...group,
            messages: [
              ...group.messages,
              { text: newMessage, sender: currentUserId },
            ],
          }
        : group,
    );
    setGroups(updatedGroups);
    const updatedSelectedGroup = updatedGroups.find(
      (g) => g.id === selectedGroup.id,
    );
    setSelectedGroup(updatedSelectedGroup || null);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen text-gray-600">
      {/* Sidebar */}
      <div
        className={`fixed h-full w-64 border-r border-gray-50 bg-white p-4 shadow-md transition-transform duration-300 ease-in-out md:static md:w-1/3 dark:border-gray-950 dark:bg-gray-900 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
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

        <button className="mb-4 w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700">
          + Compose
        </button>

        <div className="h-96 space-y-2 overflow-y-auto">
          {visibleGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => {
                setSelectedGroup(group);
                setSidebarOpen(false);
              }}
              className={`flex cursor-pointer items-center rounded-md p-3 transition-all duration-200 hover:bg-blue-100 ${
                selectedGroup?.id === group.id ? "bg-blue-200" : ""
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-gray-800" />
              <div className="ml-3">
                <p className="font-semibold">{group.name}</p>
                <p className="w-40 truncate text-sm text-gray-500">
                  {group.messages.at(-1)?.text || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Main */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center border-b border-gray-200 p-4 shadow-md dark:border-gray-900">
          <button
            className="mr-3 text-xl md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <div className="h-12 w-12 rounded-full bg-gray-800" />
          <div className="ml-3">
            <h2 className="text-lg font-semibold">{selectedGroup?.name}</h2>
            <p className="text-sm text-gray-400">
              {selectedGroup?.users.length} members
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto bg-gray-100 p-6 dark:bg-gray-800">
          <div className="mb-4 flex justify-center">
            <span className="rounded-full bg-white px-3 py-1 text-sm text-gray-500 dark:bg-gray-900">
              Today
            </span>
          </div>
          {selectedGroup?.messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  msg.sender === currentUserId
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 text-gray-600 dark:border-gray-950 dark:text-gray-400"
                }`}
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
            className="ml-2 rounded-md bg-blue-600 p-3 text-white hover:bg-blue-700"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentChat;
