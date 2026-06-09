import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ========== ENDPOINTS DE ÓRDENES ==========

  @Get()
  async findAllOrders(): Promise<Order[]> {
    return await this.ordersService.findAllOrders();
  }

  @Get('user/:userId')
  async findOrdersByUser(@Param('userId') userId: string): Promise<Order[]> {
    return await this.ordersService.findOrdersByUser(+userId);
  }

  @Get(':id')
  async findOrderById(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findOrderById(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    // Aquí le pasamos el DTO completo que ya tiene userId, total e items
    return await this.ordersService.createOrder(createOrderDto);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Order> {
    return await this.ordersService.updateOrderStatus(+id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeOrder(@Param('id') id: string): Promise<void> {
    await this.ordersService.removeOrder(+id);
  }

  @Get('items')
  async findAllOrderItems(): Promise<OrderItem[]> {
    return await this.ordersService.findAllOrderItems();
  }

  @Get(':orderId/items')
  async findItemsByOrder(
    @Param('orderId') orderId: string,
  ): Promise<OrderItem[]> {
    return await this.ordersService.findItemsByOrder(+orderId);
  }

  @Get('items/:id')
  async findOrderItemById(@Param('id') id: string): Promise<OrderItem> {
    return await this.ordersService.findOrderItemById(+id);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  async createOrderItem(
    @Body() createDto: Partial<OrderItem>,
  ): Promise<OrderItem> {
    return await this.ordersService.createOrderItem(createDto);
  }

  @Patch('items/:id')
  async updateOrderItem(
    @Param('id') id: string,
    @Body() updateDto: Partial<OrderItem>,
  ): Promise<OrderItem> {
    return await this.ordersService.updateOrderItem(+id, updateDto);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeOrderItem(@Param('id') id: string): Promise<void> {
    await this.ordersService.removeOrderItem(+id);
  }
}
