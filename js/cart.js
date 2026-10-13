/* ========== 장바구니 관리 (localStorage) ========== */

const CART_KEY = 'arduino_cart';

// 장바구니 가져오기
function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

// 장바구니 저장
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

// 장바구니에 추가
function addToCart(productId, name, price, quantity = 1, image = '') {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, name, price, quantity, image });
  }

  saveCart(cart);
  alert(`${name} ${quantity}개가 장바구니에 추가되었습니다.`);
}

// 수량 변경
function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
  }
}

// 상품 제거
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

// 장바구니 비우기
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

// 총 금액 계산
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// 상품 수 카운트
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// 헤더 장바구니 카운트 업데이트
function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    const count = getCartItemCount();
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
  }
}

// 장바구니 페이지 렌더링
function renderCartPage() {
  const container = document.getElementById('cart-items');
  const summaryEl = document.getElementById('cart-summary');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>장바구니가 비어있습니다.</p>
        <a href="../index.html" class="btn btn-primary">쇼핑 계속하기</a>
      </div>
    `;
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => {
    const imgSrc = item.image ? `<img src="${item.image}" alt="${item.name}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">` : `<div style="width:80px;height:80px;display:flex;align-items:center;justify-content:center;font-size:32px;background:#f0f0f0;border-radius:8px;">📦</div>`;
    return `
    <div class="cart-item">
      ${imgSrc}
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">${formatPrice(item.price)}</div>
      </div>
      <div class="quantity-control">
        <button onclick="changeCartQty(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeCartQty(${item.id}, 1)">+</button>
      </div>
      <div style="font-weight:700; min-width:100px; text-align:right;">
        ${formatPrice(item.price * item.quantity)}
      </div>
      <button class="remove-btn" onclick="removeCartItem(${item.id})">✕</button>
    </div>
    `;
  }).join('');

  if (summaryEl) {
    const total = getCartTotal();
    const shipping = total >= 50000 ? 0 : 3000;
    summaryEl.style.display = 'block';
    summaryEl.innerHTML = `
      <div class="summary-row">
        <span>상품 금액</span>
        <span>${formatPrice(total)}</span>
      </div>
      <div class="summary-row">
        <span>배송비</span>
        <span>${shipping === 0 ? '무료' : formatPrice(shipping)}</span>
      </div>
      <div class="summary-row summary-total">
        <span>총 결제금액</span>
        <span>${formatPrice(total + shipping)}</span>
      </div>
      <div style="margin-top:24px; text-align:right;">
        <a href="order.html" class="btn btn-accent">주문하기</a>
      </div>
    `;
  }
}

function changeCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
    saveCart(cart);
    renderCartPage();
  }
}

function removeCartItem(id) {
  if (confirm('이 상품을 장바구니에서 삭제하시겠습니까?')) {
    removeFromCart(id);
    renderCartPage();
  }
}