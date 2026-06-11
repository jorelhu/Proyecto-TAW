/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
interface RawProductStat {
  productId: string | number;
  productName: string;
  totalQuantity: string | number;
  totalRevenue: string | number;
}
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

  async findByUser(userId: number): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: { userId },
      relations: {
        items: {
          variant: {
            product: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
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
      throw new NotFoundException(`Item de orden con ID ${id} no encontrada`);
    }
  }

  // ========== ESTADÍSTICAS PARA GRÁFICOS ==========
  async getStats(startDate?: Date, endDate?: Date) {
    const end = endDate || new Date();
    const start = startDate || new Date();
    start.setDate(start.getDate() - 30); // Por defecto últimos 30 días

    // 1. Totales generales
    const orders = await this.ordersRepository.find({
      where: { createdAt: Between(start, end) },
    });
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 2. Ventas diarias
    const dailySalesMap = new Map<string, { total: number; count: number }>();
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const existing = dailySalesMap.get(date) || { total: 0, count: 0 };
      existing.total += Number(order.total);
      existing.count += 1;
      dailySalesMap.set(date, existing);
    });
    const dailySales = Array.from(dailySalesMap.entries())
      .map(([date, data]) => ({
        date,
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    // 3. Productos más vendidos
    const topProductsRaw = await this.orderItemsRepository
      .createQueryBuilder('item')
      .leftJoin('item.variant', 'variant')
      .leftJoin('variant.product', 'product')
      .where('item.createdAt BETWEEN :start AND :end', { start, end })
      .select([
        'product.id as productId',
        'product.name as productName',
        'SUM(item.quantity) as totalQuantity',
        'SUM(item.price * item.quantity) as totalRevenue',
      ])
      .groupBy('product.id')
      .orderBy('totalQuantity', 'DESC')
      .limit(5)
      .getRawMany();

    const topProducts = (topProductsRaw as RawProductStat[]).map(
      (p: RawProductStat) => ({
        productId: Number(p.productId),
        productName: p.productName,
        totalQuantity: parseInt(p.totalQuantity as string, 10),
        totalRevenue: parseFloat(p.totalRevenue as string),
      }),
    );

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      dailySales,
      topProducts,
    };
  }
}
