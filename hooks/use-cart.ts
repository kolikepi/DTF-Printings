'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export function useCartCount() {
  const { data: session } = useSession() || {};
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!session?.user) { setCount(0); return; }
    try {
      const res = await fetch('/api/cart');
      if (res?.ok) {
        const data = await res.json();
        setCount(data?.items?.length ?? 0);
      }
    } catch { setCount(0); }
  }, [session?.user]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return count;
}

export function useCart() {
  const { data: session } = useSession() || {};
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!session?.user) { setItems([]); setLoading(false); return; }
    try {
      const res = await fetch('/api/cart');
      if (res?.ok) {
        const data = await res.json();
        setItems(data?.items ?? []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [session?.user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (item: any) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res?.ok) await fetchCart();
      return res?.ok;
    } catch { return false; }
  };

  const removeItem = async (id: string) => {
    try {
      const res = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
      if (res?.ok) await fetchCart();
    } catch { /* ignore */ }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (res?.ok) await fetchCart();
    } catch { /* ignore */ }
  };

  return { items, loading, addItem, removeItem, updateQuantity, refetch: fetchCart };
}
