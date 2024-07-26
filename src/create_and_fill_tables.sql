CREATE TABLE carts (
  id UUID PRIMARY key DEAFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL,
  status VARCHAR(10) CHECK (status IN ('OPEN', 'ORDERED'))
);

create EXTENSION if not EXISTS "uuid-ossp"

INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE, CURRENT_DATE, 'OPEN'),
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE, CURRENT_DATE, 'ORDERED');


CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR,
  password VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  cart_id UUID NOT NULL,
  payment JSON NOT NULL,
  delivery JSON NOT NULL,
  comments VARCHAR,
  status VARCHAR(255) NOT NULL, -- assuming OrderStatuses is an enum, replace with the actual enum definition if needed
  total INTEGER NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES carts(id)
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  price INTEGER NOT NULL
);

CREATE TABLE cart_items (
  cart_id UUID REFERENCES carts(id),
  product_id UUID REFERENCES products(id),
  count INTEGER,
  PRIMARY KEY (cart_id, product_id)
);

INSERT INTO users (id, name, email, password) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'John Doe', 'john@example.com', 'password123'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jane Smith', 'jane@example.com', 'password456');

INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '{"paymentMethod": "credit_card"}', '{"address": "123 Main St"}', 'First order', 'OPEN', 100),
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '{"paymentMethod": "paypal"}', '{"address": "456 Elm St"}', 'Second order', 'ORDERED', 200);

INSERT INTO products (id, title, description, price) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Product 1', 'Description of Product 1', 10),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Product 2', 'Description of Product 2', 20),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Product 3', 'Description of Product 3', 30);
