import { Controller, Get, Post, Body, HttpStatus, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() products: Product[]) {
    if (!Array.isArray(products) || products.length === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Request body must be a non-empty array.',
      };
    }
    
    const createdProducts = await this.productsService.create(products);

    const message: string[] = []
    if(createdProducts.modifiedCount > 0) message.push(`Successfully modified ${createdProducts.modifiedCount} products.`)
    if(createdProducts.upsertedCount > 0) message.push(`Successfully created ${createdProducts.upsertedCount} products.`)

    return {
        message,
        data: createdProducts,
    };
  }

  @Get()
  async findAll(
    @Query('search') search: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc',
  ) {
    const products = await this.productsService.findAll({
      search,
      limit: Number(limit),
      offset: Number(offset),
      sortBy,
      sortOrder,
    });
    return products;
  }
}