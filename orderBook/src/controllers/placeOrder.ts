import { Request, Response } from "express";
import { orderInput } from "../types";
import { orderBook } from "../types/orderBook";

export const placeOrder = (req: Request, res: Response) => {
  const BASE_ASSET = "TATA";
  const QUOTE_ASSET = "INR";
  let GLOBAL_TRADE_ID = 0;

  try {
    const orderId = "order-" + Date.now();
    const input = orderInput.safeParse(req.body);
    if (!input.success) {
      res.json({ message: "INVALID_INPUT", error: input.error.message });
      return;
    }
    const { baseAsset, quoteAsset, quantity, price, side, kind, type } =
      input.data;
    if (baseAsset !== BASE_ASSET || quoteAsset !== QUOTE_ASSET) {
      res.json({ message: "INVALID_ASSETS" });
      return;
    }
    function getFilledQuantity(
      price: number,
      quantity: number,
      side: "buy" | "sell"
    ): number {
      let filledQuantity = 0;
      if (side === "buy") {
        orderBook.asks.forEach((o) => {
          if (o.price <= price) {
            filledQuantity += Math.min(o.quantity, quantity);
          }
        });
      } else {
        orderBook.bids.forEach((o) => {
          if (o.price >= price) {
            filledQuantity += Math.min(o.quantity, quantity);
          }
        });
      }
      return filledQuantity;
    }
    const maxFilledQuantity = getFilledQuantity(price, quantity, side);
    interface Fill {
      quantity: number;
      price: number;
      tradeId: number;
    }
    function fillOrder(
      price: number,
      quantity: number,
      side: "buy" | "sell",
      orderId: string,
      kind?: "ioc"
    ): {
      status: "rejected" | "accepted";
      executedQuantity: number;
      fills: Fill[];
    } {
      const fills: Fill[] = [];
      let executedQuantity = 0;
      if (kind === "ioc" && maxFilledQuantity < quantity) {
        return {
          status: "rejected",
          fills: [],
          executedQuantity: maxFilledQuantity,
        };
      }
      if (side === "buy") {
        orderBook.asks.forEach((o) => {
          if (o.price <= price && quantity > 0) {
            const filledQuantity = Math.min(o.quantity, quantity);
            o.quantity -= filledQuantity;
            fills.push({
              quantity: filledQuantity,
              price,
              tradeId: GLOBAL_TRADE_ID++,
            });
            quantity -= filledQuantity;
            executedQuantity += filledQuantity;

            if (o.quantity === 0) {
              orderBook.asks.splice(orderBook.asks.indexOf(o), 1);
            }
          }
          if (quantity !== 0) {
            orderBook.bids.push({
              price,
              quantity: o.quantity - quantity,
              side,
              orderId,
            });
          }
        });
      } else {
        orderBook.bids.forEach((o) => {
          if (o.price >= price) {
            const filledQuantity = Math.min(o.quantity, quantity);
            o.quantity -= filledQuantity;
            fills.push({
              price,
              quantity,
              tradeId: GLOBAL_TRADE_ID++,
            });
            quantity -= filledQuantity;
            executedQuantity += filledQuantity;

            if (o.quantity === 0) {
              orderBook.bids.splice(orderBook.bids.indexOf(o), 1);
            }
          }
          if (quantity !== 0) {
            orderBook.asks.push({
              price,
              quantity: quantity - executedQuantity,
              side,
              orderId,
            });
          }
        });
      }
      return {
        status: "accepted",
        executedQuantity,
        fills,
      };
    }
    const { executedQuantity, fills } = fillOrder(
      price,
      quantity,
      side,
      orderId,
      kind
    );
    res.json({
      message: "Order processed",
      executedQuantity,
      fills,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
