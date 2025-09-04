import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(createProductDto: any): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async createBulk(products: Product[]): Promise<Product[]> {
    return this.productModel.insertMany(products);
  }

//   async findAll(): Promise<Product[]> {
//     return this.productModel.find().exec();
//   }
  async findAll(query: {
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Product[]> {
    const { search, limit, offset, sortBy, sortOrder } = query;

    const findQuery: any = {};
    if (search) {
      findQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    let mongooseQuery = this.productModel.find(findQuery);
    
    if (Object.keys(sortOptions).length > 0) {
      mongooseQuery = mongooseQuery.sort(sortOptions);
    }
    
    if (offset) {
      mongooseQuery = mongooseQuery.skip(offset);
    }
    if (limit) {
      mongooseQuery = mongooseQuery.limit(limit);
    }

    return mongooseQuery.exec();
  }
}