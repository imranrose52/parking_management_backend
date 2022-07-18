import express from "express";
const app = express();
import path, { dirname } from "path";
import { errorHandler } from "./middlewares";
import cookieParser from "cookie-parser";
import cors from "cors";
import ejs from "ejs";
import { publicRouter, adminRouter } from "./routes";

app.use(express.urlencoded({ extended: false })); //for multipart data
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// ejs----------
app.set("view engine", "ejs");

app.use(express.static("./public")); // make public folder publicly available
app.use("/docs", express.static("docs"));
app.use("/api/v1", publicRouter); // init public route for login and other public pages
app.use("/api/v1/admin/", adminRouter); // admin dashboard routes

// app.use((req, res) => {
//   res.status(404).send("<h1> 404 address not found !!!...</h1>");
// });
// app.get("/", (req, res) => {
//   // let filePath = path.join(__dirname, "./ticket.ejs");
//   res.render("ticket");
//   // res.send("hello imran");
// });

// middleware error---------------------------

app.use(errorHandler); // error handler for handle all error

export default app;
