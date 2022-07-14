import express from "express";
import { catchAsyncErrors } from "../../middlewares";
import { auth } from "../../middlewares";
import { parkingController } from "../../controllers";

const adminRouter = express.Router();
adminRouter.post("/parking", catchAsyncErrors(parkingController.post));
adminRouter.get("/parking", catchAsyncErrors(parkingController.get));
adminRouter.get("/pdf", catchAsyncErrors(parkingController.pdf));

export default adminRouter;
