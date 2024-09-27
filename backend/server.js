const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(bodyParser.json());

let chatQueue = [];
let activeChats = {};

io.on("connection", (socket) => {
    console.log("New client connected");
    
    socket.on("requestQueue", () => {
        socket.emit("updateQueue", chatQueue);
    });

    socket.on("initiateChat", (data) => {
        const chatData = { ...data, customerId: socket.id };
        chatQueue.push(chatData);
        io.emit("updateQueue", chatQueue);
    });

    socket.on("assignChat", (data) => {
        const { customerId, agentId, agentName } = data;
        activeChats[customerId] = agentId;
        chatQueue = chatQueue.filter(chat => chat.customerId !== customerId);

        io.emit("updateQueue", chatQueue);

        io.to(customerId).emit("receiveMessage", {
            message: `You have been connected to an agent.`,
            customerId: customerId,
            agentName: agentName
        });
    });

    socket.on("sendMessage", (data) => {
        const { customerId, agentId, message } = data;

        if (customerId && activeChats[customerId] && !agentId) {
            const assignedAgentId = activeChats[customerId];
            io.to(assignedAgentId).emit("receiveMessage", { message, agentId: assignedAgentId });
        }

        else if (customerId && activeChats[customerId]) {
            io.to(customerId).emit("receiveMessage", { message, customerId });
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        chatQueue = chatQueue.filter(chat => chat.customerId !== socket.id);
        delete activeChats[socket.id];
        io.emit("updateQueue", chatQueue);
    });
});

server.listen(5000, () => {
    console.log("Server listening on port 5000");
});
