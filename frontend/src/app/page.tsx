import { OrderBook } from "./_components/orderBook";
import OrderForm from "./_components/orderForm";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <OrderForm />
      <OrderBook />
    </div>
  );
}
