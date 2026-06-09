// src/orders/dto/create-order.dto.ts
export class CreateOrderDto {
  userId: number;
  total: number;
  items: {
    variant: { id: number; price: number };
    quantity: number;
  }[];
}
