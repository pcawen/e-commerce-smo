import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyBulkWriteOperation, Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

    async create(products: Product[]): Promise<any> {
    const bulkOps: AnyBulkWriteOperation<Product>[] = products.map(product => ({
      updateOne: {
        filter: { sku: product.sku },
        update: { $set: product },
        upsert: true,
      },
    }));
  
    return this.productModel.bulkWrite(bulkOps, { ordered: false });
  }

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