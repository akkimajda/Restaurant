import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import OrderTypeTabs from '../components/OrderTypeTabs';
import CategoryBar from '../components/CategoryBar';
import ProductGrid from '../components/ProductGrid';
import CartPanel from '../components/CartPanel';
import { CATEGORIES, PRODUCTS } from '../mocks/menu';
import type { CartLine, OrderType, Product } from '../types';
import useActiveStation from '../hooks/useActiveStation';

export default function CashierPage() {
  const { stationId } = useActiveStation();
  const [email, setEmail] = useState<string>('');
  const [role, setRole]   = useState<string>('unknown');

  // état UI
  const [orderType, setOrderType] = useState<OrderType>('onplace');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [cart, setCart] = useState<CartLine[]>([]);

  // filtrage produits
  const visibleProducts = useMemo(() => {
    if (categoryId === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.categoryId === categoryId);
  }, [categoryId]);

  // auth info (email + role)
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

  // actions panier
  const addToCart = (p: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(l => l.product.id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { product: p, qty: 1 }];
    });
  };

  const inc = (id: string) =>
    setCart(prev => prev.map(l => l.product.id === id ? { ...l, qty: l.qty + 1 } : l));

  const dec = (id: string) =>
    setCart(prev =>
      prev.flatMap(l =>
        l.product.id !== id ? [l] :
        l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []
      )
    );

  const removeLine = (id: string) =>
    setCart(prev => prev.filter(l => l.product.id !== id));

  return (
    <div style={{ padding: 16 }}>
      {/* Header simple */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>💳 Espace Caisse</h2>
        <div style={{ color: '#6b7280' }}>
          Station courante : <b>{stationId ?? '—'}</b> — Connecté : <b>{email || '—'}</b> (rôle: {role})
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: 16,
        minHeight: 'calc(100vh - 140px)',
      }}>
        {/* Colonne gauche : type + catégories + produits */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <OrderTypeTabs value={orderType} onChange={setOrderType} />

          <div style={{ marginTop: 12 }}>
            <CategoryBar
              categories={CATEGORIES}
              value={categoryId}
              onChange={setCategoryId}
            />
          </div>

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
    </div>
  );
}
