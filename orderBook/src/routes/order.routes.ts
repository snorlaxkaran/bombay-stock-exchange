import { Router } from "express";
import { placeOrder } from "../controllers/placeOrder";
import { getOrderBook } from "../controllers/orderBook";

export const orderRoutes = Router();

orderRoutes.post("/", placeOrder);
orderRoutes.get("/orderbook", getOrderBook);
