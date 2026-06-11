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
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // ✅ Ruta relativa

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    name: string;
  };
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ==========================================
  // 1. RUTAS FIJAS / FILTROS ESPECÍFICOS (SIN PARÁMETROS DINÁMICOS)
  // ==========================================

  @Get()
  async findAllOrders(): Promise<Order[]> {
    return await this.ordersService.findAllOrders();
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.ordersService.createOrder(createOrderDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async getMyOrders(@Request() req: RequestWithUser) {
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

  // ✅ Ruta de estadísticas (debe ir ANTES de @Get(':id'))
  @Get('stats')
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.ordersService.getStats(start, end);
  }

  // ==========================================
  // 2. RUTAS CON SUB-RECURSOS (pero que contienen un ID)
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
  // 3. RUTAS DINÁMICAS GENÉRICAS (SIEMPRE AL FINAL)
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
