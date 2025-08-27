// src/pages/CashierHome.tsx
import { useEffect, useMemo, useState } from "react";

type OrderType = "Dine In" | "Take Away" | "Delivery";
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "Pizza" | "Burger" | "Chicken" | "Drinks";
};
type CartItem = { product: Product; qty: number };

const CART_KEY = "pos.cart.v1";
const ORDER_TYPE_KEY = "pos.orderType.v1";

const PRODUCTS: Product[] = [
  { id: "p1", name: "Margherita Pizza", price: 12.99, image: "https://picsum.photos/seed/p1/300/200", category: "Pizza" },
  { id: "p2", name: "Pepperoni Pizza",   price: 13.99, image: "https://picsum.photos/seed/p2/300/200", category: "Pizza" },
  { id: "p3", name: "Four Cheese",       price: 14.49, image: "https://picsum.photos/seed/p3/300/200", category: "Pizza" },
  { id: "b1", name: "Classic Burger",    price: 10.99, image: "https://picsum.photos/seed/b1/300/200", category: "Burger" },
  { id: "b2", name: "Cheese Burger",     price: 11.49, image: "https://picsum.photos/seed/b2/300/200", category: "Burger" },
  { id: "b3", name: "Double Burger",     price: 12.99, image: "https://picsum.photos/seed/b3/300/200", category: "Burger" },
  { id: "c1", name: "Fried Chicken",     price: 9.99,  image: "https://picsum.photos/seed/c1/300/200", category: "Chicken" },
  { id: "c2", name: "Chicken Wings",     price: 8.99,  image: "https://picsum.photos/seed/c2/300/200", category: "Chicken" },
  { id: "c3", name: "Spicy Tenders",     price: 9.49,  image: "https://picsum.photos/seed/c3/300/200", category: "Chicken" },
  { id: "d1", name: "Coca-Cola",         price: 2.49,  image: "https://picsum.photos/seed/d1/300/200", category: "Drinks" },
  { id: "d2", name: "Lemonade",          price: 2.29,  image: "https://picsum.photos/seed/d2/300/200", category: "Drinks" },
  { id: "d3", name: "Iced Tea",          price: 2.29,  image: "https://picsum.photos/seed/d3/300/200", category: "Drinks" },
];

export default function CashierHome() {
  const [orderType, setOrderType] = useState<OrderType>("Dine In");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Product["category"]>("All");
  const [cart, setCart] = useState<CartItem[]>([]);

  // --- PERSISTENCE: restore on load
  useEffect(() => {
    try {
      const rawCart = localStorage.getItem(CART_KEY);
      if (rawCart) {
        const parsed = JSON.parse(rawCart) as CartItem[];
        if (Array.isArray(parsed)) setCart(parsed);
      }
      const rawType = localStorage.getItem(ORDER_TYPE_KEY) as OrderType | null;
      if (rawType === "Dine In" || rawType === "Take Away" || rawType === "Delivery") {
        setOrderType(rawType);
      }
    } catch (e) {
      console.warn("Failed to restore cart", e);
    }
  }, []);

  // --- PERSISTENCE: save on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);
  useEffect(() => {
    try {
      localStorage.setItem(ORDER_TYPE_KEY, orderType);
    } catch {}
  }, [orderType]);

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, category]);

  function add(p: Product) {
    setCart(prev => {
      const i = prev.findIndex(ci => ci.product.id === p.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...prev, { product: p, qty: 1 }];
    });
  }
  const inc = (id: string) =>
    setCart(prev => prev.map(ci => ci.product.id === id ? { ...ci, qty: ci.qty + 1 } : ci));
  const dec = (id: string) =>
    setCart(prev =>
      prev.flatMap(ci =>
        ci.product.id === id ? (ci.qty > 1 ? [{ ...ci, qty: ci.qty - 1 }] : []) : [ci]
      )
    );
  const removeItem = (id: string) =>
    setCart(prev => prev.filter(ci => ci.product.id !== id));
  const clearCart = () => {
    setCart([]);
    try { localStorage.removeItem(CART_KEY); } catch {}
  };

  const subtotal = cart.reduce((s, ci) => s + ci.qty * ci.product.price, 0);
  const tax = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-emerald-900 text-white px-8 py-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
        {/* LEFT: catalogue */}
        <div className="col-span-12 lg:col-span-8">
          {/* Search */}
          <div className="flex items-center gap-3 mb-4">
            <input
              className="w-full border rounded-xl px-4 py-2"
              placeholder="Search…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="border rounded-xl px-3 py-2">Filter</button>
          </div>

          {/* Order type */}
          <div className="flex gap-3 mb-4">
            {(["Dine In", "Take Away", "Delivery"] as const).map(t => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`px-4 py-2 rounded-xl ${
                  orderType === t ? "bg-emerald-900 text-white" : "bg-white border text-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {(["All", "Pizza", "Burger", "Chicken", "Drinks"] as const).map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full border ${
                  category === c ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <h2 className="text-lg font-semibold mb-3">Popular Dishes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-28 object-cover" />
                <div className="p-3">
                  <div className="font-medium text-slate-800">{p.name}</div>
                  <div className="text-slate-500 text-sm">${p.price.toFixed(2)}</div>
                  <button
                    onClick={() => add(p)}
                    className="mt-2 w-full rounded-xl bg-emerald-900 text-white py-2"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: cart */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl border shadow-sm p-4 lg:sticky lg:top-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Order</h2>
              <div className="hidden lg:flex bg-slate-100 rounded-xl overflow-hidden">
                {(["Dine In", "Take Away", "Delivery"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setOrderType(t)}
                    className={`px-3 py-1.5 text-sm ${
                      orderType === t ? "bg-emerald-900 text-white" : "text-slate-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {cart.length === 0 ? (
              <p className="text-slate-500">No items in order yet</p>
            ) : (
              <>
                <ul className="divide-y">
                  {cart.map(ci => (
                    <li key={ci.product.id} className="py-2 flex items-center gap-2">
                      <img src={ci.product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{ci.product.name}</div>
                        <div className="text-slate-500 text-sm">
                          ${(ci.product.price * ci.qty).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => dec(ci.product.id)} className="w-8 h-8 border rounded-full">–</button>
                        <span>{ci.qty}</span>
                        <button onClick={() => inc(ci.product.id)} className="w-8 h-8 border rounded-full">+</button>
                        <button onClick={() => removeItem(ci.product.id)} className="w-8 h-8 border rounded-full">×</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button onClick={clearCart} className="mt-3 text-sm underline text-slate-500">
                  Clear cart
                </button>
              </>
            )}

            <div className="mt-4 space-y-1 text-sm text-slate-600">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-semibold text-slate-900">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="mt-4 w-full py-3 rounded-xl bg-emerald-900 text-white">
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
