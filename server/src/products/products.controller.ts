import { Controller, Get, Post, Body, HttpStatus, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @Post('bulk')
  async createBulk(@Body() products: any[]) {
    if (!Array.isArray(products) || products.length === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Request body must be a non-empty array.',
      };
    }
    
    const createdProducts = await this.productsService.createBulk(products);
    return {
        message: `Successfully created ${createdProducts.length} products.`,
        data: createdProducts,
    };
  }

//   @Get()
//   async findAll() {
//     return this.productsService.findAll();
//   }
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