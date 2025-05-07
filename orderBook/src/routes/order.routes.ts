import { Router } from "express";
import { placeOrder } from "../controllers/placeOrder";

export const orderRoutes = Router();

orderRoutes.post("/", placeOrder);
