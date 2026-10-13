-- ArduinoMall Supabase 스키마
-- Supabase SQL Editor에서 실행하세요

-- 상품 테이블
create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  category text not null check (category in ('board','sensor','module','kit')),
  price int not null,
  description text default '',
  spec text default '',
  image_url text default '',
  stock int default 0,
  badge text default '',
  created_at timestamptz default now()
);

-- 주문 테이블
create table if not exists orders (
  id bigint generated always as identity primary key,
  order_no text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text default '',
  address text not null,
  address_detail text default '',
  memo text default '',
  payment_method text default 'card',
  total_amount int not null,
  status text default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  created_at timestamptz default now()
);

-- 주문 상품 테이블
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint references orders(id) on delete cascade,
  product_id bigint references products(id),
  product_name text not null,
  quantity int not null,
  price int not null
);

-- RLS 활성화
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- 상품: 모든 사용자 읽기 가능
create policy "products_select_all" on products for select using (true);
create policy "products_insert_auth" on products for insert with check (true);
create policy "products_update_auth" on products for update using (true);

-- 주문: 인서트만 가능 (쇼핑몰 주문)
create policy "orders_insert_all" on orders for insert with check (true);
create policy "orders_select_all" on orders for select using (true);

-- 주문 상품
create policy "order_items_insert_all" on order_items for insert with check (true);
create policy "order_items_select_all" on order_items for select using (true);

-- 시드 데이터 (디바이스마트 기준 시중가)
insert into products (name, category, price, description, spec, image_url, stock, badge) values
('Arduino Uno R3', 'board', 33000, '가장 널리 쓰이는 아두이노 입문 보드. ATmega328P 기반.', 'MCU: ATmega328P / 디지털 I/O: 14개 / 아날로그 입력: 6개', 'images/products/arduino-uno.jpg', 50, 'best'),
('Arduino Mega 2560', 'board', 55000, '대규모 프로젝트용 고사양 보드. 54개 디지털 I/O.', 'MCU: ATmega2560 / 디지털 I/O: 54개 / Flash: 256KB', 'images/products/arduino-mega.jpg', 30, ''),
('Arduino Nano', 'board', 22000, '소형 프로젝트·브레드보드용 초소형 보드.', 'MCU: ATmega328P / 크기: 18x45mm', 'images/products/arduino-nano.jpg', 80, ''),
('DHT11 온습도 센서', 'sensor', 3500, '온도·습도 측정 디지털 센서.', '온도: 0~50℃ / 습도: 20~80%', 'images/products/dht11.jpg', 200, ''),
('HC-SR04 초음파 센서', 'sensor', 3000, '2~400cm 거리 측정 초음파 센서.', '측정 범위: 2~400cm / 정확도: 3mm', 'images/products/hcsr04.jpg', 150, ''),
('PIR 모션 센서', 'sensor', 4500, '적외선 기반 인체 모션 감지 센서.', '감지 거리: 7m / 각도: 120°', 'images/products/pir-sensor.jpg', 100, 'new'),
('SG90 서보 모터', 'module', 3500, '소형 서보 모터. 로봇·팬 제어용.', '토크: 1.8kg·cm / 각도: 180°', 'images/products/sg90.jpg', 120, ''),
('릴레이 모듈 4채널', 'module', 7500, '4채널 릴레이. 가전기기 ON/OFF 제어.', '정격: 250VAC 10A / 5V 구동', 'images/products/relay-4ch.jpg', 60, ''),
('LCD 1602 I2C 모듈', 'module', 5500, '16x2 LCD + I2C 백팩. 2핀 연결.', '화면: 16문자 x 2행 / I2C / 블루백라이트', 'images/products/lcd1602.jpg', 90, ''),
('아두이노 스타터 키트', 'kit', 65000, '입문자 풀 패키지. Uno + 센서 + 부품 + 메뉴얼.', '포함: Uno, 브레드보드, 센서, LED, 저항 등 30종', 'images/products/starter-kit.jpg', 25, 'best'),
('IoT WiFi 키트 (ESP8266)', 'kit', 42000, 'WiFi IoT 프로젝트 키트. ESP8266 + 센서 + 가이드.', '포함: NodeMCU, DHT11, LED, 서보모터 등', 'images/products/iot-kit.jpg', 20, 'new'),
('점퍼와이어 세트 (60P)', 'kit', 5000, 'M-M/M-F/F-F 각 20개, 총 60개.', '길이: 20cm / 60피스', 'images/products/jumper-wire.jpg', 300, '');
