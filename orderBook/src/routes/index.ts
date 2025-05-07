import { Router } from "express";
import { orderRoutes } from "./order.routes";

export const routes = Router();

routes.use("/order", orderRoutes);
