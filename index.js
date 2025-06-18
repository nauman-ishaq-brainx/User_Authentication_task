//constants
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const cors = require("cors");
const reminderJob = require('./utils/reminderJob');
reminderJob.start();




app.use(
  cors()
);


const port = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: CLIENT_URL
    }
})


io.on("connection", (socket) => {
  console.log("A user connected");

  // Broadcast task update
  socket.on("task_updated", (updatedTask) => {
    socket.broadcast.emit("task_updated", updatedTask);
  });

  // Broadcast new invite
  socket.on("shared_task_invite", (inviteData) => {
    socket.broadcast.emit("shared_task_invite", inviteData);
  });
  socket.on("task_deleted", (taskId) => {
    socket.broadcast.emit("task_deleted", taskId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const connectDb = require('./connections/connect');






// JSON parser
app.use(express.json());

//setup routes
app.use('/api/v1', require('./routes/index'))


//DB connection
connectDb().then(()=>{
    server.listen(port, () => {
  console.log('Server + Socket.IO listening on port', port);
});
});
;
