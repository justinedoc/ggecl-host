import { Server as IOServer } from "socket.io";
import { Server as HttpServer } from "http";

interface GroupData {
  admin: string;
  students: string[];
}

const groups: Record<string, GroupData> = {};

export function initSocket(server: HttpServer) {
  const io = new IOServer(server, {
    cors: {
      origin: ["http://localhost:5173", "https://ggecl-preview.vercel.app"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("createGroup", (groupId: string, adminId: string) => {
      if (!groups[groupId]) {
        groups[groupId] = {
          admin: adminId,
          students: [],
        };
        socket.join(groupId);
        console.log(`Group ${groupId} created by admin ${adminId}`);
      } else {
        socket.emit("error", "Group already exists");
      }
    });

    socket.on("joinGroup", (groupId: string, studentId: string) => {
      const group = groups[groupId];

      if (group && !group.students.includes(studentId)) {
        group.students.push(studentId);
        socket.join(groupId);
        console.log(`👨‍🎓 Student ${studentId} joined group ${groupId}`);
        io.to(groupId).emit("message", {
          from: "system",
          text: `${studentId} has joined the group`,
        });
      } else {
        socket.emit("error", "Group does not exist or you already joined");
      }
    });

    socket.on(
      "sendMessage",
      (
        groupId: string,
        senderId: string,
        role: "admin" | "student",
        message: string | null,
        image: string | null
      ) => {
        const group = groups[groupId];

        if ((message === null || !message.trim()) && !image) {
          socket.emit("error", "Message or image must be provided");
          return;
        }

        if (
          group &&
          ((role === "admin" && group.admin === senderId) ||
            (role === "student" && group.students.includes(senderId)))
        ) {
          io.to(groupId).emit("message", {
            from: senderId,
            role,
            text: message ? message.trim() : null,
            image: image || null,
          });
        } else {
          socket.emit("error", "Not authorized to send messages to this group");
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}
