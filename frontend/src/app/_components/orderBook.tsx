"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type Order = {
  price: number;
  quantity: number;
  side: "buy" | "sell";
  orderId: string;
};

export const OrderBook = () => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/v1/order/orderbook"
        );
        setBids(res.data.bids || []);
        setAsks(res.data.asks || []);
      } catch (err) {
        console.error("Error fetching order book", err);
      }
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 2000); // refresh every 2 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" w-full mt-10 p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Order Book</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h3 className="font-semibold text-green-600 mb-2">
            Buy Orders (Bids)
          </h3>
          {bids.length === 0 ? (
            <p className="text-gray-500">No bids</p>
          ) : (
            bids
              .sort((a, b) => b.price - a.price)
              .map((bid, i) => (
                <div key={i} className="flex justify-between">
                  <span>{bid.price}</span>
                  <span>{bid.quantity}</span>
                </div>
              ))
          )}
        </div>
        <div>
          <h3 className="font-semibold text-red-600 mb-2">
            Sell Orders (Asks)
          </h3>
          {asks.length === 0 ? (
            <p className="text-gray-500">No asks</p>
          ) : (
            asks
              .sort((a, b) => a.price - b.price)
              .map((ask, i) => (
                <div key={i} className="flex justify-between">
                  <span>{ask.price}</span>
                  <span>{ask.quantity}</span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};
