// Add this to your order controller or route file
import { Request, Response } from "express";
import { orderBook } from "../types/orderBook";

export const getOrderBook = (req: Request, res: Response) => {
  res.json(orderBook);
};
