import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @ApiProperty({ description: 'Product SKU. Unique identifier', required: true })
  @Prop({ required: true, unique: true })
  sku: string;

  @ApiProperty({ description: 'Product name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Product price' })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ description: 'Product description' })
  @Prop()
  description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);