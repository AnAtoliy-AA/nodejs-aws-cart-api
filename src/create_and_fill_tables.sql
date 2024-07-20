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


CREATE TABLE cart_items (
  cart_id UUID REFERENCES carts(id),
  product_id UUID,
  count INTEGER,
  PRIMARY KEY (cart_id, product_id)
);

INSERT INTO cart_items (cart_id, product_id, count) VALUES
('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 2),
('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 3),
('22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 1);

