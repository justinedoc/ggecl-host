import { useState, useEffect } from "react";
import { FaPaperPlane, FaBars, FaTimes } from "react-icons/fa";
import io from "socket.io-client";

// interface User {
//   id: string;
//   name: string;
//   message: string;
//   time: string;
//   active: boolean;
// }

interface Message {
  text: string;
  sender: string;
}

interface Group {
  id: string;
  name: string;
  admin: string;
  message: string;
  time: string;
  instructors: string[];
  students: string[];
}

// Dummy data for instructors and students (replace with your actual data fetching)
const availableInstructors = [
  { id: "inst1", name: "Professor Smith" },
  { id: "inst2", name: "Dr. Jones" },
];

const availableStudents = [
  { id: "stu1", name: "Alice" },
  { id: "stu2", name: "Bob" },
  { id: "stu3", name: "Charlie" },
];

const initialGroups: Group[] = [
  {
    id: "physics-group-id",
    name: "Physics Group",
    admin: "admin",
    message: "Yeah sure, tell me zafor",
    time: "just now",
    instructors: [],
    students: [],
  },
];

const socket = io("http://localhost:4000");

const AdminChat = () => {
  const [selectedGroup, setSelectedGroup] = useState<Group>(initialGroups[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groupList, setGroupList] = useState<Group[]>(initialGroups);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("getGroupMessages", selectedGroup.id, (initialMessages: Message[]) => {
      setMessages(initialMessages);
    });

    socket.on("message", (data: { groupId: string; message: Message }) => {
      if (data.groupId === selectedGroup.id) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [selectedGroup.id]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: Message = { text: newMessage, sender: "Admin" };
    setMessages([...messages, msg]);

    socket.emit(
      "sendMessageToGroup",
      selectedGroup.id,
      msg,
      (response: any) => {
        if (!response.success) {
          console.error("Error sending message:", response.error);
        }
      }
    );

    setNewMessage("");
  };

  useEffect(() => {
    socket.on("groupCreated", (data: Group) => {
      console.log("New group created:", data);
      setGroupList((prev) => [...prev, data]);
    });

    return () => {
      socket.off("groupCreated");
    };
  }, []);

  const handleOpenCreateGroupModal = () => {
    setIsCreateGroupModalOpen(true);
  };

  const handleCloseCreateGroupModal = () => {
    setIsCreateGroupModalOpen(false);
    setNewGroupName("");
    setSelectedInstructors([]);
    setSelectedStudents([]);
  };

  const handleToggleInstructor = (instructorId: string) => {
    setSelectedInstructors((prev) =>
      prev.includes(instructorId) ? prev.filter((id) => id !== instructorId) : [...prev, instructorId]
    );
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleCreateNewGroup = () => {
    if (!newGroupName.trim()) {
      alert("Please enter a group name.");
      return;
    }

    const instructorNames = availableInstructors
      .filter((inst) => selectedInstructors.includes(inst.id))
      .map((inst) => inst.name);

    const studentNames = availableStudents
      .filter((stu) => selectedStudents.includes(stu.id))
      .map((stu) => stu.name);

    const groupDetails = {
      groupName: newGroupName,
      adminId: "admin-id", // Assuming a static admin ID for now
      instructorNames: instructorNames,
      studentNames: studentNames,
    };

    socket.emit("createGroup", groupDetails, (response: any) => {
      if (response.success) {
        console.log("Group created successfully:", response.newGroup);
        setGroupList((prev) => [...prev, response.newGroup]);
        handleCloseCreateGroupModal();
      } else {
        console.error("Error creating group:", response.error);
      }
    });
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
          <button className="text-xl md:hidden" onClick={() => setSidebarOpen(false)}>
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
          {groupList.map((group) => (
            <div
              key={group.id}
              onClick={() => {
                setSelectedGroup(group);
                setSidebarOpen(false);
                socket.emit("getGroupMessages", group.id, (messages: Message[]) => {
                  setMessages(messages);
                });
              }}
              className={`flex cursor-pointer items-center rounded-md p-3 transition-all duration-200 hover:bg-blue-100 ${
                selectedGroup.id === group.id ? "bg-blue-200" : ""
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-semibold">
                {group.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-semibold">{group.name}</p>
                <p className="w-40 truncate text-sm text-gray-500">{group.message}</p>
              </div>
              <span className="ml-auto text-sm text-gray-400">{group.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center border-b border-gray-200 p-4 shadow-md dark:border-gray-900">
          <button className="mr-3 text-xl md:hidden" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>
          <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-semibold">
            {selectedGroup.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold">{selectedGroup.name}</h2>
            <p className="text-sm text-gray-400">
              Instructors: {selectedGroup.instructors.join(", ") || "None"}, Students:{" "}
              {selectedGroup.students.join(", ") || "None"}
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
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === "Admin" ? "items-end" : "items-start"}`}
            >
              <span className={`text-sm text-gray-500 dark:text-gray-400 ${msg.sender === "Admin" ? "self-end" : "self-start"} mb-1`}>
                {msg.sender}
              </span>
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  msg.sender === "Admin" ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 dark:border-gray-950 dark:text-gray-400"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
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

      {/* Create Group Modal */}
      {isCreateGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-tranparent backdrop-blur-2xl bg-opacity-50">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 h-[90%] ">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                  className="w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Group Name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>

              <div className="mb-4 text-left">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Instructors
                </label>
                <ul className="h-28 overflow-y-auto border rounded-md dark:border-gray-600">
                  {availableInstructors.map((instructor) => (
                    <li key={instructor.id} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-offset-gray-800"
                          value={instructor.id}
                          checked={selectedInstructors.includes(instructor.id)}
                          onChange={() => handleToggleInstructor(instructor.id)}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{instructor.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4 text-left">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Students
                </label>
                <ul className="h-32 overflow-y-scroll border rounded-md dark:border-gray-600">
                  {availableStudents.map((student) => (
                    <li key={student.id} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-offset-gray-800"
                          value={student.id}
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleToggleStudent(student.id)}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{student.name}</span>
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