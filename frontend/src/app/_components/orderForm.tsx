"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type orderSide = "buy" | "sell";
type orderKind = "ioc" | "limit";

type OrderResult = {
  orderId: string;
  status: string;
  [key: string]: any; // You can fine-tune this further
};

const OrderForm = () => {
  const [side, setSide] = useState<orderSide>("buy");
  const [type, setType] = useState<orderKind>("limit");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setError(null);

    try {
      const res = await axios.post("http://localhost:3001/api/v1/order", {
        baseAsset: "TATA",
        quoteAsset: "INR",
        side,
        type: "limit",
        price: parseFloat(price),
        quantity: parseFloat(quantity),
      });
      setResult(res.data);
    } catch (error: unknown) {
      setError("Unknown error");
    }
  };

  useEffect(() => {
    const getCurrentPrice = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/order/price");
        if (res.data !== currentPrice) {
          setCurrentPrice(res.data);
        }
      } catch (error: unknown) {
        setError("Unknown error");
      }
    };

    getCurrentPrice();

    const interval = setInterval(getCurrentPrice, 1); // refresh every 2 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full p-4 bg-white shadow-xl rounded-lg mt-10">
      <p>{currentPrice}</p>
      <h2 className="text-2xl font-bold mb-4">Place Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setSide("buy")}
            className={`px-4 py-2 rounded ${
              side === "buy" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide("sell")}
            className={`px-4 py-2 rounded ${
              side === "sell" ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            Sell
          </button>
        </div>
        <div>
          <label className="block mb-1">Order Kind</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as orderKind)}
            className="w-full border p-2 rounded"
          >
            <option value="limit">Limit</option>
            <option value="ioc">IOC</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Place Order
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && (
        <div className="mt-4">
          <h3 className="font-bold">Order Result:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
