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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(+id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, {storage: diskStorage({ destination: './uploads/products',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },}),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new Error('Solo imágenes permitidas'), false);
      }
      callback(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async createWithImages(
    @Body() productData: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    // Crear el producto con los datos de texto
    const product = await this.productsService.create({
      name: productData.name,
      brand: productData.brand,
      description: productData.description,
      topNotes: productData.topNotes,
      heartNotes: productData.heartNotes,
      baseNotes: productData.baseNotes,
    });

    // Procesar las imágenes si existen
    if (files && files.length > 0) {
      console.log(
        'Imágenes recibidas:',
        files.map((f) => f.filename),
      );
      // Aquí puedes guardar las rutas en la tabla productimage
    }

    return product;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<Product>,
  ): Promise<Product> {
    return await this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.productsService.remove(+id);
  }
}
