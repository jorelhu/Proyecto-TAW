/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  // ========== ÓRDENES ==========
  async findAllOrders(): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: {
        user: true,
        items: {
          variant: true,
        },
      },
    });
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        user: true,
        items: {
          variant: {
            product: true,
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return order;
  }

  async findOrdersByUser(userId: number): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: { userId },
      relations: {
        items: {
          variant: true,
        },
      },
    });
  }

  // En src/orders/orders.service.ts
  // En src/orders/orders.service.ts

  async createOrder(data: CreateOrderDto): Promise<Order> {
    // Usa el DTO aquí
    return await this.ordersRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const newOrder = this.ordersRepository.create({
          userId: data.userId,
          total: data.total,
          status: 'pending',
        });
        const savedOrder = await transactionalEntityManager.save(
          Order,
          newOrder,
        );

        const orderItems = data.items.map((item) =>
          this.orderItemsRepository.create({
            orderId: savedOrder.id,
            variantId: item.variant.id,
            quantity: item.quantity,
            price: item.variant.price,
          }),
        );

        await transactionalEntityManager.save(OrderItem, orderItems);
        return savedOrder;
      },
    );
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = await this.findOrderById(id);
    order.status = status;
    return await this.ordersRepository.save(order);
  }

  async removeOrder(id: number): Promise<void> {
    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
  }

  // ========== ITEMS DE ORDEN ==========
  async findAllOrderItems(): Promise<OrderItem[]> {
    return await this.orderItemsRepository.find({
      relations: {
        order: true,
        variant: {
          product: true,
        },
      },
    });
  }

  async findOrderItemById(id: number): Promise<OrderItem> {
    const item = await this.orderItemsRepository.findOne({
      where: { id },
      relations: {
        order: true,
        variant: {
          product: true,
        },
      },
    });
    if (!item) {
      throw new NotFoundException(`Item de orden con ID ${id} no encontrado`);
    }
    return item;
  }

  async findItemsByOrder(orderId: number): Promise<OrderItem[]> {
    return await this.orderItemsRepository.find({
      where: { orderId },
      relations: {
        variant: {
          product: true,
        },
      },
    });
  }

  async createOrderItem(data: Partial<OrderItem>): Promise<OrderItem> {
    const item = this.orderItemsRepository.create(data);
    return await this.orderItemsRepository.save(item);
  }

  async updateOrderItem(
    id: number,
    data: Partial<OrderItem>,
  ): Promise<OrderItem> {
    await this.orderItemsRepository.update(id, data);
    return this.findOrderItemById(id);
  }

  async removeOrderItem(id: number): Promise<void> {
    const result = await this.orderItemsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Item de orden con ID ${id} no encontrado`);
    }
  }
}
