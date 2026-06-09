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
import { ProductImagesService } from './product-images.service';
import { ProductImage } from './product-image.entity';

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly imagesService: ProductImagesService) {}

  @Get()
  async findAll(): Promise<ProductImage[]> {
    return await this.imagesService.findAll();
  }

  @Get('product/:productId')
  async findByProduct(
    @Param('productId') productId: string,
  ): Promise<ProductImage[]> {
    return await this.imagesService.findByProduct(+productId);
  }

  @Get('product/:productId/primary')
  async findPrimary(
    @Param('productId') productId: string,
  ): Promise<ProductImage | null> {
    return await this.imagesService.findPrimary(+productId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductImage> {
    return await this.imagesService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: Partial<ProductImage>,
  ): Promise<ProductImage> {
    return await this.imagesService.create(createDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<ProductImage>,
  ): Promise<ProductImage> {
    return await this.imagesService.update(+id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.imagesService.remove(+id);
  }
}
