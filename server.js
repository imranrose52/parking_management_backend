import app from "./app";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDatabase from "./config/database";
import { webSocket } from "./services/socket";

dotenv.config({ path: "config/config.env" }); // env config

const httpServer = createServer(app); //  creating server

connectDatabase(); // connecting database-----------------

// Handling Uncauth Exception --------------------------------------------------------
process.on("uncauthRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shutting down the server due to Uncauth Exception");
  process.exit(1);
});

// init server ----------------------------------------------------------------------
export const server = httpServer.listen(process.env.PORT, () => {
  console.log(
    `server is working on http://${process.env.HOST_NAME}:${process.env.PORT}`
  );
});

// webshokets--------------------------------------------------------------
export const io = new Server(server, {
  /* options */
});

webSocket(); // init webshoket conncetion and listner

// Unhandled promise Rejection -------------------------------------

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err}`);
  console.log("Shutting down the server due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
