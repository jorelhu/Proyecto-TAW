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
import { ProductVariantsService } from './product-variants.service';
import { ProductVariant } from './product-variant.entity';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly variantsService: ProductVariantsService) {}

  @Get()
  async findAll(): Promise<ProductVariant[]> {
    return await this.variantsService.findAll();
  }

  @Get('product/:productId')
  async findByProduct(
    @Param('productId') productId: string,
  ): Promise<ProductVariant[]> {
    return await this.variantsService.findByProduct(+productId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductVariant> {
    return await this.variantsService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: Partial<ProductVariant>,
  ): Promise<ProductVariant> {
    return await this.variantsService.create(createDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<ProductVariant>,
  ): Promise<ProductVariant> {
    return await this.variantsService.update(+id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.variantsService.remove(+id);
  }
}
