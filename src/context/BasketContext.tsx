import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";

export interface BasketItem {
  productId: string;
  colour: string;
  size: string;
  qty: number;
}

type ItemKey = { productId: string; colour: string; size: string };

type Action =
  | { type: "add"; item: BasketItem }
  | { type: "remove"; key: ItemKey }
  | { type: "setQty"; key: ItemKey; qty: number }
  | { type: "clear" };

const STORAGE_KEY = "dg-basket";
const MAX_QTY = 10;

const sameItem = (a: ItemKey, b: ItemKey) =>
  a.productId === b.productId && a.colour === b.colour && a.size === b.size;

function reducer(state: BasketItem[], action: Action): BasketItem[] {
  switch (action.type) {
    case "add": {
      const exists = state.some((i) => sameItem(i, action.item));
      if (!exists) return [...state, action.item];
      return state.map((i) =>
        sameItem(i, action.item) ? { ...i, qty: Math.min(MAX_QTY, i.qty + action.item.qty) } : i
      );
    }
    case "remove":
      return state.filter((i) => !sameItem(i, action.key));
    case "setQty":
      if (action.qty <= 0) return state.filter((i) => !sameItem(i, action.key));
      return state.map((i) =>
        sameItem(i, action.key) ? { ...i, qty: Math.min(MAX_QTY, action.qty) } : i
      );
    case "clear":
      return [];
  }
}

function loadBasket(): BasketItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as BasketItem[]) : [];
  } catch {
    return [];
  }
}

interface BasketValue {
  items: BasketItem[];
  count: number;
  add: (item: BasketItem) => void;
  remove: (key: ItemKey) => void;
  setQty: (key: ItemKey, qty: number) => void;
  clear: () => void;
}

const BasketContext = createContext<BasketValue | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, [], loadBasket);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage not available: the basket just won't be remembered
    }
  }, [items]);

  const value: BasketValue = {
    items,
    count: items.reduce((sum, i) => sum + i.qty, 0),
    add: (item) => dispatch({ type: "add", item }),
    remove: (key) => dispatch({ type: "remove", key }),
    setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
    clear: () => dispatch({ type: "clear" }),
  };

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used inside <BasketProvider>");
  return ctx;
}