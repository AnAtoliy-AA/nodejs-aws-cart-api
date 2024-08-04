-- Ensure uuid-ossp extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR,
  password VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create carts table
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL,
  status VARCHAR(10) CHECK (status IN ('OPEN', 'ORDERED')),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  cart_id UUID NOT NULL,
  payment JSON NOT NULL,
  delivery JSON NOT NULL,
  comments VARCHAR,
  status VARCHAR(255) CHECK (status IN ('PENDING', 'FINISHED')), -- adjust according to your enum
  total INTEGER NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES carts(id)
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  price INTEGER NOT NULL
);

-- Create cart_items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES carts(id),
  product_id UUID REFERENCES products(id),
  count INTEGER NOT NULL
);

-- Insert sample data into users table
INSERT INTO users (id, name, email, password) VALUES
('170ebd09-817a-43a1-b132-d9806a8e98b2', 'John Doe', 'john@example.com', 'password123'),
('60b9e768-a82c-4695-93cd-7fbbc83a367c', 'Jane Smith', 'jane@example.com', 'password456');

-- Insert sample data into carts table
INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
('94fe05f8-5ce2-4958-9719-dc5bb6f6de00', '170ebd09-817a-43a1-b132-d9806a8e98b2', CURRENT_DATE, CURRENT_DATE, 'OPEN'),
('8cedd376-7c1d-4ead-bd0e-cf76ce0ec740', '60b9e768-a82c-4695-93cd-7fbbc83a367c', CURRENT_DATE, CURRENT_DATE, 'ORDERED');

-- Insert sample data into products table
INSERT INTO products (id, title, description, price) VALUES
('2a3aa779-ad1f-4fdd-8dbf-732ecacd7bcb', 'Product 1', 'Description of Product 1', 10),
('d8075260-0d3d-4d46-aec0-6bb499ccacd8', 'Product 2', 'Description of Product 2', 20),
('4533a1e0-cf68-4283-945f-5c243e372b20', 'Product 3', 'Description of Product 3', 30);

-- Insert sample data into cart_items table
INSERT INTO cart_items (id, cart_id, product_id, count) VALUES
(uuid_generate_v4(), '94fe05f8-5ce2-4958-9719-dc5bb6f6de00', '2a3aa779-ad1f-4fdd-8dbf-732ecacd7bcb', 1),
(uuid_generate_v4(), '8cedd376-7c1d-4ead-bd0e-cf76ce0ec740', 'd8075260-0d3d-4d46-aec0-6bb499ccacd8', 2);

-- Insert sample data into orders table
INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total) VALUES
('94fe05f8-5ce2-4958-9719-dc5bb6f6de00', '170ebd09-817a-43a1-b132-d9806a8e98b2', '94fe05f8-5ce2-4958-9719-dc5bb6f6de00', '{"paymentMethod": "credit_card"}', '{"address": "123 Main St"}', 'First order', 'PENDING', 100),
('8cedd376-7c1d-4ead-bd0e-cf76ce0ec740', '60b9e768-a82c-4695-93cd-7fbbc83a367c', '8cedd376-7c1d-4ead-bd0e-cf76ce0ec740', '{"paymentMethod": "paypal"}', '{"address": "456 Elm St"}', 'Second order', 'FINISHED', 200);
