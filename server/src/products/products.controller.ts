import { Controller, Get, Post, Body, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update multiple products' })
  @ApiResponse({ status: 201, description: 'Products successfully created or updated.' })
  @ApiResponse({ status: 400, description: 'Input must be a non-empty array' })
  @ApiBody({ type: [Product], description: 'An array of products' })
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
  @ApiOperation({ summary: 'Retrieve a list of products with optional search, sorting, and pagination' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved products.' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for product name or description' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Maximum number of items to return' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Property to sort by [name, price]' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
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