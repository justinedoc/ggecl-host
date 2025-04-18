import { useState } from "react";
import { FaPaperPlane, FaBars, FaTimes } from "react-icons/fa";
import { useChat } from "@/hooks/useChatHook";
import socketService from "@/socket/socketService";

// Define the Message type without groupId since it's part of the group context
type Message = {
  senderId: string;
  sender: string;
  text: string;
  image?: string;
  timestamp?: string;
  role?: string;
};

const AdminChat = () => {
  const currentUserId = "admin1";
  const currentUserRole = "admin";
  const { groups, selectedGroup, setSelectedGroup, sendMessage } = useChat(
    currentUserId,
    currentUserRole,
  );

  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [availableInstructors] = useState([
    { id: "instructor1", name: "Instructor One" },
    { id: "instructor2", name: "Instructor Two" },
  ]);
  const [availableStudents] = useState([
    { id: "student1", name: "Student One" },
    { id: "student2", name: "Student Two" },
  ]);

  const handleToggleInstructor = (instructorId: string) => {
    setSelectedInstructors((prev) =>
      prev.includes(instructorId)
        ? prev.filter((id) => id !== instructorId)
        : [...prev, instructorId],
    );
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const handleOpenCreateGroupModal = () => {
    setIsCreateGroupModalOpen(true);
  };

  const handleCloseCreateGroupModal = () => {
    setIsCreateGroupModalOpen(false);
  };

  const handleCreateNewGroup = () => {
    if (!newGroupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    const groupDetails = {
      groupId: `group-${Date.now()}`,
      groupName: newGroupName.trim(),
      adminId: currentUserId,
      students: selectedStudents,
      instructors: selectedInstructors,
    };

    socketService.createGroup(groupDetails, (response) => {
      if (response.success) {
        setIsCreateGroupModalOpen(false);
        setNewGroupName("");
        setSelectedInstructors([]);
        setSelectedStudents([]);
      } else {
        alert(response.error || "Failed to create group");
      }
    });
  };

  const handleSendMessage = () => {
    if (!selectedGroup || !newMessage.trim()) return;

    try {
      sendMessage(selectedGroup.groupId, { text: newMessage });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
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
        <button
          onClick={handleOpenCreateGroupModal}
          className="mb-4 w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Create Group
        </button>
        <div className="h-96 space-y-2 overflow-y-auto">
          {groups.map((group) => (
            <div
              key={group.groupId}
              onClick={() => {
                setSelectedGroup(group);
                setSidebarOpen(false);
              }}
              className={`flex cursor-pointer items-center rounded-md p-3 transition-all duration-200 hover:bg-blue-100 ${
                selectedGroup?.groupId === group.groupId ? "bg-blue-200" : ""
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 font-semibold text-white">
                {group.groupName
                  ? group.groupName.substring(0, 2).toUpperCase()
                  : "NA"}
              </div>
              <div className="ml-3">
                <p className="font-semibold">{group.groupName}</p>
                <p className="w-40 truncate text-sm text-gray-500">
                  {group.messages && group.messages.length > 0
                    ? group.messages[group.messages.length - 1].text ||
                      "No message text"
                    : `Group created by admin`}
                </p>
              </div>
              <span className="ml-auto text-sm text-gray-400">
                {group.lastMessageTime
                  ? new Date(group.lastMessageTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center border-b border-gray-200 p-4 shadow-md dark:border-gray-900">
          <button
            className="mr-3 text-xl md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 font-semibold text-white">
            {selectedGroup?.groupName
              ? selectedGroup.groupName.substring(0, 2).toUpperCase()
              : "NA"}
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold">
              {selectedGroup?.groupName || "No Group Selected"}
            </h2>
            <p className="text-sm text-gray-400">
              Instructors:{" "}
              {(selectedGroup?.instructors || []).join(", ") || "None"},
              Students: {(selectedGroup?.students || []).join(", ") || "None"}
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
          {selectedGroup?.messages?.map((msg, index) => (
            <div
              key={`${msg.senderId}-${index}`}
              className={`flex flex-col ${
                msg.senderId === currentUserId ? "items-end" : "items-start"
              }`}
            >
              <span
                className={`text-sm text-gray-500 dark:text-gray-400 ${
                  msg.senderId === currentUserId ? "self-end" : "self-start"
                } mb-1`}
              >
                {msg.sender}
              </span>
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  msg.senderId === currentUserId
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 text-gray-600 dark:border-gray-950 dark:text-gray-400"
                }`}
              >
                <p>{msg.text}</p>
              </div>
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Message Attachment"
                  className="mt-2 max-w-xs rounded-lg"
                />
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex border-t border-gray-200 p-4 shadow-md dark:border-gray-900">
          <input
            type="text"
            placeholder={
              selectedGroup ? "Type your message..." : "Select a group to chat"
            }
            className="flex-1 rounded-md border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!selectedGroup}
          />
          <button
            onClick={handleSendMessage}
            disabled={!selectedGroup || !newMessage.trim()}
            className="ml-2 rounded-md bg-blue-600 p-3 text-white transition-all duration-200 hover:bg-blue-700 disabled:bg-gray-400"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>

      {/* Create Group Modal */}
      {isCreateGroupModalOpen && (
        <div className="bg-tranparent bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl">
          <div className="relative h-[90%] w-full max-w-md rounded-lg bg-white shadow dark:bg-gray-800">
            <button
              type="button"
              className="absolute top-3 right-2.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleCloseCreateGroupModal}
            >
              <FaTimes className="h-5 w-5" />
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-6 text-center">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">
                Create a New Group
              </h3>
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Group Name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>

              <div className="mb-4 text-left">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Instructors
                </label>
                <ul className="h-28 overflow-y-auto rounded-md border dark:border-gray-600">
                  {availableInstructors.map((instructor) => (
                    <li
                      key={instructor.id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800"
                          value={instructor.id}
                          checked={selectedInstructors.includes(instructor.id)}
                          onChange={() => handleToggleInstructor(instructor.id)}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          {instructor.name}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4 text-left">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Students
                </label>
                <ul className="h-32 overflow-y-scroll rounded-md border dark:border-gray-600">
                  {availableStudents.map((student) => (
                    <li
                      key={student.id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800"
                          value={student.id}
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleToggleStudent(student.id)}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          {student.name}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleCreateNewGroup}
                className="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChat;
