// import express from 'express';
// import "dotenv/config";
// import cors from "cors";
// import  http from "http";
// import { connectDB } from './lib/db.js';
// import userRouter from './routes/userRoutes.js';
// import messageRouter from './routes/messageRoutes.js';
// import { Server } from 'socket.io';


// //Create Exprees and the HTTP server

// const app=express();
// const server=http.createServer( app);

// //Initialize socket.io server
// export const io=new Server(server,{
//        cors:{origin:"*"}
// });
// //Store online users
// export const userSocketMap={};//{userId:socketId}

// //Socket.io connection handler
// io.on("connection",(socket)=>{
// const userId=socket.handshake.query.userId;
// console.log("User Connected",userId);

// if(userId) userSocketMap[userId]=socket.id;

// //Emit online users to all connected clinet
// io.emit("getOnlineUsers",Object.keys(userSocketMap));
// socket.on("disconnect",()=>{
//     console.log("User Disconnected",userId);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers",Object.keys(userSocketMap))
// })

// }) 



// //Middleware setup
// app.use(express.json({limit:"4"}));
// app.use(cors());

// //Routes Setup
// app.use("/api/status",(req,res)=>res.send("Server is Live"));
// app.use("/api/auth",userRouter);
// app.use("/api/messages",messageRouter)

// //Connect to MongoDB
// await connectDB();

// const PORT=process.env.PORT || 5000;
// server.listen(PORT,()=>console.log("Server is running on PORT: "+ PORT));


import express from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

// ✅ Socket.io setup
export const io = new Server(server, {
    cors: { origin: "*" }
});

export const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// ✅ Middleware setup
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Routes Setup
app.use("/api/status", (req, res) => res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ✅ Connect to MongoDB
await connectDB();

if(process.env.NODE_ENV!=="production"){
const PORT = process.env.PORT || 5000;
      server.listen(PORT, () => console.log(`✅ Server running on PORT: ${PORT}`));
}
//Export server for Vercel
export default server;

