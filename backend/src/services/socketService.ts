import { Server as IOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";

interface GroupData {
  admin: string;
  name: string;
  students: string[];
}

interface CreateGroupData {
  groupId: string;
  adminId: string;
  groupName: string;
  students: string[];
}

interface MessageData {
  groupId: string;
  senderId: string;
  sender: string;
  role: "admin" | "student";
  text: string | null;
  image: string | null;
}

export class SocketService {
  private io: IOServer;
  private groups: Record<string, GroupData> = {};

  constructor(server: HttpServer) {
    this.io = new IOServer(server, {
      cors: {
        origin: ["http://localhost:5174", "https://ggecl-preview.vercel.app"],
        credentials: true,
      },
    });

    this.initializeEvents();
  }

  private initializeEvents(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("Socket connected:", socket.id);

      this.handleCreateGroup(socket);
      this.handleJoinGroup(socket);
      this.handleSendMessage(socket);
      this.handleReceiveMessage(socket);
      this.handleDisconnect(socket);
    });
  }

  private handleCreateGroup(socket: Socket): void {
    socket.on(
      "createGroup",
      ({ groupId, adminId, groupName, students }: CreateGroupData) => {
        if (!this.groups[groupId]) {
          this.groups[groupId] = {
            admin: adminId,
            name: groupName,
            students,
          };

          socket.join(groupId);

          console.log(
            `Creating group ${groupName} by admin ${groupId} with students: ${students.join(
              ", "
            )}`
          );

          this.io.emit("groupCreated", {
            groupId,
            adminId,
            groupName,
            students,
          });

          this.io.emit("allGroups", this.groups);
        } else {
          socket.emit("error", "Group already exists");
        }
      }
    );
  }

  private handleJoinGroup(socket: Socket): void {
    socket.on("joinGroup", (groupId: string, studentId: string) => {
      const group = this.groups[groupId];

      if (group && !group.students.includes(studentId)) {
        group.students.push(studentId);
        socket.join(groupId);
        console.log(`👨‍🎓 Student ${studentId} joined group ${groupId}`);
        this.io.to(groupId).emit("message", {
          from: "system",
          text: `${studentId} has joined the group`,
        });
      } else {
        socket.emit("error", "Group does not exist or you already joined");
      }
    });
  }

  private handleSendMessage(socket: Socket): void {
    socket.on("sendMessage", (data: MessageData) => {
      const { groupId, senderId, role, sender, text, image } = data;
      const group = this.groups[groupId];

      if ((!text || (typeof text === "string" && !text.trim())) && !image) {
        socket.emit("error", "Message or image must be provided");
        return;
      }

      if (
        group &&
        ((role === "admin" && group.admin === senderId) ||
          (role === "student" && group.students.includes(senderId)))
      ) {
        this.io.to(groupId).emit("message", {
          groupId, // the group id to access the group
          senderId, // the id of the sender
          role, // the role of the sender (admin or student)
          sender: sender, // the name of the sender
          text: text ? text.trim() : null, // the message text (if any)
          image: image || null, // the image (if any)
        });
      } else {
        socket.emit("error", "Not authorized to send messages to this group");
      }
    });
  }

  private handleReceiveMessage(socket: Socket): void {
    socket.on("receiveMessage", (data: MessageData) => {
      const { groupId, senderId, role, sender, text, image } = data;
      const group = this.groups[groupId];

      if (group) {
        this.io.to(groupId).emit("message", {
          groupId,
          senderId,
          role,
          sender,
          text: text ? text.trim() : null,
          image: image || null,
        });
      } else {
        socket.emit("error", "Group does not exist");
      }
    });
  }

  private handleDisconnect(socket: Socket): void {
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  }

  public getGroups(): Record<string, GroupData> {
    return this.groups;
  }
}
