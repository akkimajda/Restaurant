// src/pages/CashierHome.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession } from "../lib/session";

// ---- Types ----
type OrderType = "Dine In" | "Take Away" | "Delivery";
type Category = "Pizza" | "Burger" | "Pasta" | "Noodles" | "Salad" | "Dessert" | "Drinks";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;          // chemin vers /public
  category: Category;
};
type CartItem = { product: Product; qty: number };
type PaymentMethod = "CASH" | "CARD";

// ---- Keys de persistence ----
const CART_KEY = "pos.cart.v1";
const ORDER_TYPE_KEY = "pos.orderType.v1";
const ORDERS_KEY = "pos.orders.v1";

// ---- Helpers ----
function saveOrder(order: any) {
  try {
    const list = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    list.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Failed to save order", e);
  }
}

// ✅ Produits avec VRAIES images (dossier: public/img/menu)
const PRODUCTS: Product[] = [
  // Pizzas
  { id: "p1", name: "Margherita Pizza",    price: 12.99, image: "/img/menu/margherit.jpg",   category: "Pizza"   },
  { id: "p2", name: "Pepperoni Pizza",     price: 13.99, image: "/img/menu/pepperoni.jpg",   category: "Pizza"   },

  // Burgers
  { id: "b1", name: "Cheeseburger",        price: 11.49, image: "/img/menu/cheeseburger.jpg", category: "Burger"  },
  { id: "b2", name: "Double Bacon Burger", price: 12.99, image: "/img/menu/double-bacon.jpg", category: "Burger"  },

  // Pasta
  { id: "pa1", name: "Spaghetti Bolognese", price: 12.49, image: "/img/menu/bolognaise.jpg",  category: "Pasta"   },
  { id: "pa2", name: "Spaghetti Carbonara", price: 12.49, image: "/img/menu/carbonara.jpg",   category: "Pasta"   },

  // Noodles
  { id: "no1", name: "Miso Ramen",          price: 11.99, image: "/img/menu/miso.jpg",        category: "Noodles" },

  // Salads
  { id: "sa1", name: "Panda Salad",         price:  7.99, image: "/img/menu/salade-panda.jpg", category: "Salad"  },

  // Desserts
  { id: "de1", name: "Chocolate Fondant",   price:  5.49, image: "/img/menu/fondant.jpg",     category: "Dessert" },
  { id: "de2", name: "Tiramisu",            price:  5.49, image: "/img/menu/tiramisu.jpg",    category: "Dessert" },

  // Drinks
  { id: "d1", name: "Coca-Cola",            price:  2.49, image: "/img/menu/coca.jpg",        category: "Drinks"  },
  { id: "d2", name: "Orange Juice",         price:  2.79, image: "/img/menu/orange.jpg",      category: "Drinks"  },
];

export default function CashierHome() {
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState<OrderType>("Dine In");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [cart, setCart] = useState<CartItem[]>([]);

  const [payOpen, setPayOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");

  const [ordersOpen, setOrdersOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  // ✅ catégories calculées automatiquement d'après les produits
  const categoryOptions = useMemo(
    () => ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))] as Array<"All" | Category>,
    []
  );

  // ---- Restore persistence ----
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
      refreshOrders();
    } catch (e) {
      console.warn("Failed to restore cart", e);
    }
  }, []);

  useEffect(() => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {} }, [cart]);
  useEffect(() => { try { localStorage.setItem(ORDER_TYPE_KEY, orderType); } catch {} }, [orderType]);

  function refreshOrders() {
    try {
      const list = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      setOrders(Array.isArray(list) ? list : []);
    } catch {
      setOrders([]);
    }
  }

  // ---- Filtrage ----
  const filtered = useMemo(() => {
    return PRODUCTS.filter(p =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, category]);

  // ---- Panier ----
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

  // ---- Totaux ----
  const subtotal = cart.reduce((s, ci) => s + ci.qty * ci.product.price, 0);
  const tax = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  // ---- Paiement ----
  function confirmPayment() {
    const id = (globalThis as any)?.crypto?.randomUUID?.() ?? String(Date.now());
    const order = {
      id,
      createdAt: new Date().toISOString(),
      orderType,
      paymentMethod,
      items: cart.map(ci => ({
        id: ci.product.id,
        name: ci.product.name,
        price: ci.product.price,
        qty: ci.qty,
        lineTotal: +(ci.product.price * ci.qty).toFixed(2),
      })),
      subtotal,
      tax,
      total,
      status: "PAID" as const,
    };
    saveOrder(order);
    refreshOrders();
    clearCart();
    setPayOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-emerald-900 text-white px-8 py-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { refreshOrders(); setOrdersOpen(true); }}
            className="rounded-xl bg-white text-emerald-900 px-4 py-2"
          >
            Orders ({orders.length})
          </button>

          <button
            onClick={() => { clearSession(); navigate("/"); }}
            className="rounded-xl border border-white/40 px-4 py-2 text-white hover:bg-white/10"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
        {/* LEFT: catalogue */}
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-center gap-3 mb-4">
            <input
              className="w-full border rounded-xl px-4 py-2"
              placeholder="Search…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="border rounded-xl px-3 py-2">Filter</button>
          </div>

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

          {/* ✅ Catégories dynamiques */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {categoryOptions.map(c => (
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
                      <img src={ci.product.image} alt={ci.product.name} className="w-12 h-12 rounded-lg object-cover" />
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

            <button
              className="mt-4 w-full py-3 rounded-xl bg-emerald-900 text-white disabled:opacity-50"
              disabled={total === 0}
              onClick={() => setPayOpen(true)}
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {payOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[520px] rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-semibold">Payment</h3>

            <div className="mb-4 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>

            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setPaymentMethod("CASH")}
                className={`flex-1 rounded-lg border px-4 py-2 ${paymentMethod === "CASH" ? "border-emerald-700 bg-emerald-50" : ""}`}
              >
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod("CARD")}
                className={`flex-1 rounded-lg border px-4 py-2 ${paymentMethod === "CARD" ? "border-emerald-700 bg-emerald-50" : ""}`}
              >
                Card
              </button>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setPayOpen(false)} className="rounded-lg border px-4 py-2">
                Cancel
              </button>
              <button onClick={confirmPayment} className="rounded-lg bg-emerald-700 px-4 py-2 text-white">
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {ordersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[720px] max-h-[80vh] overflow-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Orders history</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { localStorage.removeItem(ORDERS_KEY); refreshOrders(); }}
                  className="rounded-lg border px-3 py-1.5 text-sm"
                >
                  Clear history
                </button>
                <button onClick={() => setOrdersOpen(false)} className="rounded-lg border px-3 py-1.5 text-sm">
                  Close
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="text-slate-500">No orders yet.</p>
            ) : (
              <ul className="space-y-3">
                {orders.map((o) => (
                  <li key={o.id} className="rounded-xl border p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">#{o.id.slice(-6).toUpperCase()}</div>
                      <div className="text-sm text-slate-500">{new Date(o.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      <span className="mr-2">Type: <b>{o.orderType}</b></span>
                      <span className="mr-2">Pay: <b>{o.paymentMethod}</b></span>
                      <span>Status: <b className="text-emerald-700">{o.status || "PAID"}</b></span>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      {o.items?.length || 0} items — <b>${Number(o.total).toFixed(2)}</b>
                    </div>
                    {o.items?.length ? (
                      <ul className="mt-2 text-sm text-slate-600 list-disc pl-5">
                        {o.items.map((it: any) => (
                          <li key={it.id}>
                            {it.qty} × {it.name} — ${Number(it.lineTotal).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
