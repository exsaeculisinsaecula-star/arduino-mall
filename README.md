# ArduinoMall — 아두이노 부품 쇼핑몰

디바이스마트 기준 아두이노/전자부품 전문 쇼핑몰 프로젝트입니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | HTML5, CSS3, Vanilla JavaScript |
| 백엔드 | Supabase (PostgreSQL + RLS) |
| 이미지 | Unsplash (자유 라이선스) |
| 배포 | GitHub Pages |

## 폴더 구조

```
arduino-mall/
├── index.html                  # 메인 (상품 목록, 검색, 필터)
├── pages/
│   ├── product.html            # 상품 상세
│   ├── cart.html               # 장바구니
│   ├── order.html              # 주문/결제
│   └── order-complete.html     # 주문 완료
├── css/style.css               # 전체 스타일
├── js/
│   ├── products.js             # 상품 로드/필터/검색
│   ├── cart.js                 # 장바구니 (localStorage)
│   ├── supabase-client.js      # Supabase 연동
│   └── config.js               # Supabase 연결 설정
├── data/products.json          # 상품 데이터 (fallback)
├── images/products/            # 상품 이미지 (12종)
└── supabase/schema.sql         # DB 스키마 + 시드 데이터
```

## Supabase 설정

1. [supabase.com](https://supabase.com)에서 프로젝트 생성
2. **SQL Editor**에서 `supabase/schema.sql` 실행
3. **Project Settings → API**에서 URL / anon key 확인
4. `js/config.js`에 실제 값 입력:

```js
export const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
export const SUPABASE_ANON_KEY = 'your-anon-key';
```

> 설정하지 않으면 `data/products.json` + localStorage로 동작합니다.

## 로컬 실행

```bash
python -m http.server 8000
# → http://localhost:8000
```

## 가격 정보

디바이스마트(devicemart.co.kr) 및 국내 시중가 기준 (2025):
- Arduino Uno R3: 33,000원
- Arduino Mega 2560: 55,000원
- Arduino Nano: 22,000원
- DHT11: 3,500원 / HC-SR04: 3,000원 / PIR: 4,500원
- SG90: 3,500원 / 릴레이 4CH: 7,500원 / LCD 1602: 5,500원
- 스타터 키트: 65,000원 / IoT 키트: 42,000원 / 점퍼와이어: 5,000원
