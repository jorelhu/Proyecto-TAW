/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
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
  UseGuards,
  Request,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ==========================================
  // 1. RUTAS FIJAS / FILTROS ESPECÍFICOS (SIEMPRE ARRIBA)
  // ==========================================

  @Get()
  async findAllOrders(): Promise<Order[]> {
    return await this.ordersService.findAllOrders();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async getMyOrders(@Request() req: any) {
    // Apuntamos directamente a .userId que es donde viene el identificador 123126
    return await this.ordersService.findByUser(req.user.userId);
  }

  @Get('items')
  async findAllOrderItems(): Promise<OrderItem[]> {
    return await this.ordersService.findAllOrderItems();
  }

  @Get('user/:userId')
  async findOrdersByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Order[]> {
    return await this.ordersService.findOrdersByUser(userId);
  }

  // ==========================================
  // 2. RUTAS DE ACCIÓN (POST / CREACIÓN)
  // ==========================================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.ordersService.createOrder(createOrderDto);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  async createOrderItem(
    @Body() createDto: Partial<OrderItem>,
  ): Promise<OrderItem> {
    return await this.ordersService.createOrderItem(createDto);
  }

  // ==========================================
  // 3. RUTAS CON SUB-RECURSOS O RUTAS COMPUESTAS
  // ==========================================

  @Get('items/:id')
  async findOrderItemById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderItem> {
    return await this.ordersService.findOrderItemById(id);
  }

  @Get(':orderId/items')
  async findItemsByOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderItem[]> {
    return await this.ordersService.findItemsByOrder(orderId);
  }

  @Patch('items/:id')
  async updateOrderItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<OrderItem>,
  ): Promise<OrderItem> {
    return await this.ordersService.updateOrderItem(id, updateDto);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeOrderItem(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.ordersService.removeOrderItem(id);
  }

  // ==========================================
  // 4. RUTAS DINÁMICAS GENÉRICAS (SIEMPRE AL FINAL)
  // ==========================================

  @Get(':id')
  async findOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return await this.ordersService.findOrderById(id);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ): Promise<Order> {
    return await this.ordersService.updateOrderStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeOrder(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.ordersService.removeOrder(id);
  }
}
