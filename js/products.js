/* ========== 상품 데이터 관리 ========== */

const PRODUCTS_URL = 'data/products.json';

let allProducts = [];

// 상품 데이터 로드 (local JSON — Supabase 연동 시 supabase-client.js 사용)
async function loadProducts() {
  try {
    // Supabase가 설정되어 있으면 사용, 아니면 local JSON
    const mod = await import('./supabase-client.js').catch(() => null);
    if (mod && typeof mod.fetchProducts === 'function') {
      const { SUPABASE_URL } = await import('./config.js').catch(() => ({}));
      if (SUPABASE_URL && !SUPABASE_URL.includes('YOUR_PROJECT')) {
        allProducts = await mod.fetchProducts();
        return allProducts;
      }
    }
  } catch (e) {
    // silent fallback
  }
  const response = await fetch(PRODUCTS_URL);
  allProducts = await response.json();
  return allProducts;
}

// 카테고리 한글 매핑
const CATEGORY_MAP = {
  board: '보드',
  sensor: '센서',
  module: '모듈',
  kit: '키트'
};

// 상품 카드 HTML 생성
function createProductCard(product) {
  const badgeHTML = product.badge
    ? `<span class="badge ${product.badge}">${product.badge === 'best' ? 'BEST' : 'NEW'}</span>`
    : '';

  const stockText = product.stock > 0
    ? `재고 ${product.stock}개`
    : '<span style="color:#E53935">품절</span>';

  return `
    <div class="product-card" onclick="goToDetail(${product.id})">
      <div class="thumb">
        <img src="${product.image}" alt="${product.name}" loading="lazy"
             onerror="this.style.display='none'">
        ${badgeHTML}
      </div>
      <div class="info">
        <div class="category-tag">${CATEGORY_MAP[product.category] || product.category}</div>
        <div class="name">${product.name}</div>
        <div class="price">${formatPrice(product.price)}</div>
        <div class="stock-info">${stockText}</div>
      </div>
    </div>
  `;
}

// 상품 목록 렌더링
function renderProducts(products, containerId = 'product-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#999; grid-column:1/-1; padding:40px;">상품이 없습니다.</p>';
    return;
  }

  container.innerHTML = products.map(createProductCard).join('');
}

// 카테고리 필터
function filterByCategory(category) {
  if (category === 'all') return allProducts;
  return allProducts.filter(p => p.category === category);
}

// 검색
function searchProducts(keyword) {
  const lower = keyword.toLowerCase();
  return allProducts.filter(p =>
    p.name.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower)
  );
}

// 상품 상세 조회
function getProductById(id) {
  return allProducts.find(p => p.id === id);
}

// 상세 페이지 이동
function goToDetail(id) {
  window.location.href = `pages/product.html?id=${id}`;
}

// 가격 포맷
function formatPrice(price) {
  return Number(price).toLocaleString('ko-KR') + '원';
}