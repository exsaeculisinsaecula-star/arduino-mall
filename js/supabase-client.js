// Supabase 클라이언트 초기화
// supabase/config.js 에 실제 값을 넣으세요

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 상품 조회 (Supabase 우선, 실패 시 local JSON)
export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');
    if (!error && data && data.length > 0) return data;
  } catch (e) {
    console.warn('Supabase 연결 실패, local JSON으로 대체:', e.message);
  }
  // fallback: local JSON
  const res = await fetch('data/products.json');
  return await res.json();
}

// 주문 생성
export async function createOrder(order, items) {
  try {
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    if (orderErr) throw orderErr;

    const itemsWithOrderId = items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);
    if (itemsErr) throw itemsErr;

    return orderData;
  } catch (e) {
    console.error('주문 저장 실패:', e.message);
    // fallback: localStorage
    const orders = JSON.parse(localStorage.getItem('arduino_orders') || '[]');
    const localOrder = { ...order, id: Date.now(), items };
    orders.push(localOrder);
    localStorage.setItem('arduino_orders', JSON.stringify(orders));
    return localOrder;
  }
}