import { useState, useEffect } from "react";
import { FaPaperPlane, FaBars, FaTimes } from "react-icons/fa";
import socketService from "@/socket/socketService";

interface Message {
  text: string;
  sender: string;
  timestamp?: number;
}

interface Group {
  groupId: string;
  groupName: string;
  adminId: string;
  students: string[];
  messages?: Message[];
}

const StudentChat = () => {
  const currentUserId = "student2";
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket and load groups
  useEffect(() => {
    socketService.connect(currentUserId);

    // Mock initial groups - replace with actual API call
    const loadInitialGroups = () => {
      setIsLoading(true);
      setError(null);

      setTimeout(() => {
        try {
          setGroups([
            {
              groupId: "group1",
              groupName: "React Learners",
              adminId: "admin1",
              students: ["student1", "student2"],
              messages: [
                {
                  text: "Welcome to the group!",
                  sender: "admin1",
                  timestamp: Date.now() - 10000,
                },
                {
                  text: "Thanks!",
                  sender: "student1",
                  timestamp: Date.now() - 5000,
                },
              ],
            },
            {
              groupId: "group2",
              groupName: "Next.js Pros",
              adminId: "admin1",
              students: ["student2"],
              messages: [
                {
                  text: "Any Next.js users here?",
                  sender: "admin1",
                  timestamp: Date.now() - 3000,
                },
              ],
            },
          ]);
        } catch (err) {
          setError("Failed to load groups");
          console.error("Error loading groups:", err);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    };

    loadInitialGroups();

    return () => {
      socketService.disconnect();
    };
  }, [currentUserId]);

  // Handle real-time updates
  useEffect(() => {
    const handleGroupCreated = (newGroup: Group) => {
      console.log("New group received:", newGroup);
      const transformedGroup = {
        ...newGroup,
        messages: newGroup.messages || [],
      };

      setGroups((prev) => [...prev, transformedGroup]);

      if (newGroup.students.includes(currentUserId)) {
        setSelectedGroup(transformedGroup);
      }
    };

    const handleNewMessage = (data: { groupId: string; message: Message }) => {
      setGroups((prev) =>
        prev.map((group) =>
          group.groupId === data.groupId
            ? { ...group, messages: [...(group.messages || []), data.message] }
            : group,
        ),
      );

      if (selectedGroup?.groupId === data.groupId) {
        setSelectedGroup((prev) =>
          prev
            ? {
                ...prev,
                messages: [...(prev.messages || []), data.message],
              }
            : null,
        );
      }
    };

    socketService.on("groupCreated", handleGroupCreated);
    socketService.on("newMessage", handleNewMessage);

    return () => {
      socketService.off("groupCreated", handleGroupCreated);
      socketService.off("newMessage", handleNewMessage);
    };
  }, [currentUserId, selectedGroup]);

  const sendMessage = () => {
    if (!selectedGroup || !newMessage.trim()) return;

    const message: Message = {
      text: newMessage.trim(),
      sender: currentUserId,
      timestamp: Date.now(),
    };

    // Optimistic UI update
    setSelectedGroup((prev) =>
      prev ? { ...prev, messages: [...(prev.messages || []), message] } : null,
    );

    setGroups((prev) =>
      prev.map((group) =>
        group.groupId === selectedGroup.groupId
          ? { ...group, messages: [...(group.messages || []), message] }
          : group,
      ),
    );

    // Send via socket
    socketService.emit(
      "sendMessage",
      {
        groupId: selectedGroup.groupId,
        message,
      },
      (response: { success: boolean; error?: string }) => {
        if (!response.success) {
          console.error("Failed to send message:", response.error);
          // Revert optimistic update if failed
          setGroups((prev) => prev);
          setSelectedGroup((prev) => prev);
        }
      },
    );

    setNewMessage("");
  };

  // Filter groups that current user is IN
  const visibleGroups = groups.filter((group) =>
    group.students.includes(currentUserId),
  );

  // Format time for messages
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed z-20 h-full w-64 border-r border-gray-200 bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out md:static md:z-0 md:w-80 md:translate-x-0 dark:border-gray-700 dark:bg-gray-800 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Chat Groups</h2>
          <button
            className="text-xl text-gray-500 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : visibleGroups.length > 0 ? (
            <div
              className="mt-4 space-y-2 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              {visibleGroups.map((group) => (
                <div
                  key={group.groupId}
                  onClick={() => {
                    setSelectedGroup(group);
                    setSidebarOpen(false);
                  }}
                  className={`flex cursor-pointer items-center rounded-lg p-3 transition-colors duration-200 ${
                    selectedGroup?.groupId === group.groupId
                      ? "bg-blue-100 dark:bg-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                    {group.groupName.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <p className="truncate font-medium">{group.groupName}</p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {group.messages && group.messages.length > 0
                        ? `${group.messages[group.messages.length - 1].sender === currentUserId ? "You" : group.messages[group.messages.length - 1].sender}: ${group.messages[group.messages.length - 1].text}`
                        : "No messages yet"}
                    </p>
                  </div>
                  {group.messages && group.messages.length > 0 && (
                    <span className="ml-2 text-xs text-gray-400">
                      {formatTime(
                        group.messages[group.messages.length - 1].timestamp,
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500">You haven't joined any groups yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center border-b border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <button
            className="mr-3 text-xl text-gray-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
          {selectedGroup ? (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {selectedGroup.groupName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold">
                  {selectedGroup.groupName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedGroup.students.length} member
                  {selectedGroup.students.length !== 1 ? "s" : ""}
                </p>
              </div>
            </>
          ) : (
            <div className="ml-3">
              <h2 className="text-lg font-semibold">No group selected</h2>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
          {selectedGroup ? (
            <>
              <div className="mb-4 flex justify-center">
                <span className="rounded-full bg-white px-3 py-1 text-sm text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400">
                  {new Date().toLocaleDateString([], {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {selectedGroup.messages && selectedGroup.messages.length > 0 ? (
                <div className="space-y-3">
                  {selectedGroup.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.sender === currentUserId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-xs flex-col rounded-xl px-4 py-2 ${
                          msg.sender === currentUserId
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-800 shadow dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <p className="text-xs font-semibold">
                          {msg.sender === currentUserId ? "You" : msg.sender}
                        </p>
                        <p className="py-1">{msg.text}</p>
                        <span
                          className={`text-xs ${
                            msg.sender === currentUserId
                              ? "text-blue-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No messages in this group yet
                    </p>
                    <p className="text-sm text-gray-400">
                      Send a message to start the conversation
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a group to start chatting
                </p>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 md:hidden"
                >
                  Browse groups
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              placeholder={
                selectedGroup
                  ? "Type your message..."
                  : "Select a group to chat"
              }
              className="flex-1 rounded-l-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={!selectedGroup}
            />
            <button
              onClick={sendMessage}
              disabled={!selectedGroup || !newMessage.trim()}
              className="rounded-r-md bg-blue-600 px-4 text-white hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-gray-600"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChat;
