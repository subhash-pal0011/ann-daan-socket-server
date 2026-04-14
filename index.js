import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// IS LINE KA MTLB HII --- createServer se hum actual server banate hain jisme Socket connect hota hai.
const server = http.createServer(app);

const io = new Server(server, {
       cors: {
              origin: process.env.NEXT_URL || "*",
       },
});

const connectedUsers = new Map();

app.get("/", (req, res) => {
       res.send("Server is running");
});

io.on("connection", (socket) => {

       // console.log(" Connected:", socket.id);

       socket.on("userId", async (userId) => {
              connectedUsers.set(socket.id, userId);

              // console.log("User Connected:", userId);

              await axios.post(`${process.env.NEXT_URL}/api/socket/connectSocket`, {
                     userId,
                     socketId: socket.id,
              });
       });


       socket.on("updated-location", async ({ userId, latitude, longitude }) => {

              const location = {
                     type: "Point",
                     coordinates: [longitude, latitude]
              }
              await axios.post(`${process.env.NEXT_URL}/api/socket/UpdatedGeoLocationUser`, { userId, location })

              // IS EMIT SE JO NGO KA LOCATION CHANGE HOGA FOOD DONATION USER JB  TRACK ORDER KREGA TB NGO KO LOCATON REL TIME DIKHEGA NGO KAHJA PE HII
              io.emit("update-ngo-location", {
                     userId,
                     location,
              });
       })


       socket.on("disconnect", async () => {
              const userId = connectedUsers.get(socket.id);

              if (userId) {
                     await axios.post(`${process.env.NEXT_URL}/api/socket/disconnectSocket`, {
                            userId,
                     });

                     connectedUsers.delete(socket.id);
              }
       });
});
// notificatio ye eventName nhi hii ek route hii. IS ROUTE KE THRUGH EK HANDELER BNAYENGE US HANDELER KE THRUGH HUM DATA KO REAL TIME KRYENGE.
app.post("/notification", (req, res) => {
       const { eventName, data, socketId } = req.body;

       if (socketId) {
              io.to(socketId).emit(eventName, data);
       } else {
              io.emit(eventName, data);
       }

       return res.status(200).json({ success: true });
});

server.listen(PORT, () => {
       console.log(` Server started on http://localhost:${PORT}`);
});
