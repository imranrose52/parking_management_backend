import express from "express";
import { catchAsyncErrors } from "../../middlewares";
import { auth } from "../../middlewares";
import { parkingController } from "../../controllers";

const adminRouter = express.Router();
adminRouter.post("/parking", catchAsyncErrors(parkingController.post));
adminRouter.get("/parking", catchAsyncErrors(parkingController.get));
adminRouter.put("/parking/:id", catchAsyncErrors(parkingController.update));
adminRouter.delete("/parking/:id", catchAsyncErrors(parkingController.delete));

// total parking count----------------
adminRouter.get(
  "/parkingCount",
  catchAsyncErrors(parkingController.getParkingCount)
);

export default adminRouter;
