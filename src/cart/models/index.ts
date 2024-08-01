export enum CartStatuses {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED'
}

export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
};


export type CartItem = {
  product?: Product,
  count: number,
}

export type Cart = {
  id: string,
  user_id: string,
  created_at: string | Date,
  updated_at: string | Date,
  status: CartStatuses,
  items: CartItem[],
}
