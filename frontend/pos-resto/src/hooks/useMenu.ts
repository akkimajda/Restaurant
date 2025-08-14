import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { MenuCategory, MenuItem } from '../types/menu';
import type { Product } from '../types';
import { PRODUCTS as MOCK_PRODS } from '../mocks/menu';

export type UiCategory = { id: string; name: string };

function capitalise(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/**
 * Récupère le menu.
 * - Charge les catégories + items depuis Supabase (actifs, triés).
 * - Fusionne les items BDD avec les mocks (les items BDD “écrasent” les mocks s’ils partagent le même id).
 * - Construit la liste des catégories à partir de (catégories BDD + catégories dérivées des items).
 */
export function useMenu() {
  const [dbCats, setDbCats] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [{ data: catsData, error: catsErr }, { data: itemsData, error: itemsErr }] =
          await Promise.all([
            supabase
              .from('menu_categories')
              .select('*')
              .eq('is_active', true)
              .order('sort_order', { ascending: true }),
            supabase
              .from('menu_items')
              .select('*')
              .eq('is_active', true)
              .order('sort_order', { ascending: true }),
          ]);

        if (catsErr) throw catsErr;
        if (itemsErr) throw itemsErr;

        if (cancelled) return;

        setDbCats(catsData ?? []);

        // Mappe lignes BDD -> Product (types front)
        const mapped: Product[] = (itemsData ?? []).map((row: MenuItem) => ({
          id: String(row.id),
          name: row.name,
          price: row.price,
          categoryId: String(row.category_id),
          image: row.image_url ?? undefined,
          description: (row as any).description ?? undefined,
        }));

        // 👉 Fusion Mocks + BDD : on part des mocks, puis on remplace/complète avec la BDD
        const byId = new Map<string, Product>();
        for (const m of MOCK_PRODS) byId.set(m.id, m);
        for (const p of mapped) byId.set(p.id, p);

        setItems(Array.from(byId.values()));
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 👉 Construit la liste des catégories (union BDD + dérivées depuis les items)
  const categories: UiCategory[] = useMemo(() => {
    const map = new Map<string, string>();

    // D’abord celles de la BDD
    (dbCats ?? []).forEach((c) => map.set(String(c.id), c.name));

    // Puis celles trouvées dans les items
    items.forEach((p) => {
      if (!map.has(p.categoryId)) map.set(p.categoryId, capitalise(p.categoryId));
    });

    return [{ id: 'all', name: 'All items' }, ...Array.from(map, ([id, name]) => ({ id, name }))];
  }, [dbCats, items]);

  return { categories, items, loading, error };
}

export default useMenu;
