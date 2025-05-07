interface order {
  price: number;
  quantity: number;
  orderId: string;
}

interface Asks extends order {
  side: "sell";
}

interface Bids extends order {
  side: "buy";
}

export const orderBook: {
  asks: Asks[];
  bids: Bids[];
} = {
  asks: [],
  bids: [],
};
