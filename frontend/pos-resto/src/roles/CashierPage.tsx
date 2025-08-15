import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import OrderTypeTabs from '../components/OrderTypeTabs';
import CategoryBar from '../components/CategoryBar';
import ProductGrid from '../components/ProductGrid';
import CartPanel from '../components/CartPanel';
import useActiveStation from '../hooks/useActiveStation';
import useMenu from '../hooks/useMenu';
import type { CartLine, OrderType, Product } from '../types';

export default function CashierPage() {
  const { stationId } = useActiveStation();

  // Infos auth (entête)
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('manager');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? '');
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        if (data?.role) setRole(data.role);
      }
    })();
  }, []);

  // Menu (BDD + mocks via hook unifié)
  const { categories, items, loading, error } = useMenu();

  // État UI
  const [orderType, setOrderType] = useState<OrderType>('onplace');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [query, setQuery] = useState<string>('');          // recherche
  const [cart, setCart] = useState<CartLine[]>([]);

  // Filtrage produits (catégorie + recherche)
  const visibleProducts = useMemo(() => {
    const base =
      categoryId === 'all'
        ? items
        : items.filter((p) => p.categoryId === categoryId);

    const q = query.trim().toLowerCase();
    if (!q) return base;

    return base.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q),
    );
  }, [items, categoryId, query]);

  // Actions panier
  const addToCart = (p: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((l) => l.product.id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { product: p, qty: 1 }];
    });
  };

  const inc = (id: string) =>
    setCart((prev) =>
      prev.map((l) => (l.product.id === id ? { ...l, qty: l.qty + 1 } : l)),
    );

  const dec = (id: string) =>
    setCart((prev) =>
      prev.flatMap((l) =>
        l.product.id !== id ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : [],
      ),
    );

  const removeLine = (id: string) =>
    setCart((prev) => prev.filter((l) => l.product.id !== id));

  return (
    <div style={{ padding: 16 }}>
      {/* Header simple */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>💳 Espace Caisse</h2>
        <div style={{ color: '#6b7280' }}>
          Station courante : <b>{stationId ?? '—'}</b> — Connecté :{' '}
          <b>{email || '—'}</b> (rôle: {role})
        </div>
      </div>

      {loading && <div style={{ padding: 16 }}>Chargement du menu…</div>}
      {error && (
        <div style={{ padding: 16, color: 'red' }}>Erreur : {error}</div>
      )}

      {!loading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 360px',
            gap: 16,
            minHeight: 'calc(100vh - 140px)',
          }}
        >
          {/* Colonne gauche : type + recherche + catégories + produits */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <OrderTypeTabs value={orderType} onChange={setOrderType} />

            {/* Recherche */}
            <div style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit…"
                aria-label="Rechercher un produit"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  outline: 'none',
                }}
              />
            </div>

            <CategoryBar
              categories={categories}
              value={categoryId}
              onChange={setCategoryId}
            />

            <div style={{ flex: 1, overflow: 'auto' }}>
              <ProductGrid products={visibleProducts} onAdd={addToCart} />
            </div>
          </div>

          {/* Colonne droite : panier */}
          <CartPanel
            lines={cart}
            onInc={inc}
            onDec={dec}
            onRemove={removeLine}
          />
        </div>
      )}
    </div>
  );
}
