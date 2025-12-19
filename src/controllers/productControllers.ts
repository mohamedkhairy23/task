import { Request, Response } from "express";
import { Product } from "../entities/Product.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateProductDto } from "../dtos/product/create-product.dto.js";
import { UpdateProductDto } from "../dtos/product/update-product.dto.js";

/**
 * CREATE PRODUCT
 */
export const createProduct = async (req: Request, res: Response) => {
  const dto = plainToInstance(CreateProductDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const product = Product.create({
    ...dto,
    isActive: dto.isActive ?? true,
  });

  await product.save();
  return res.status(201).json(product);
};

/**
 * GET ALL PRODUCTS
 */
export const getProducts = async (_: Request, res: Response) => {
  const products = await Product.find({
    order: { createdAt: "DESC" },
  });

  return res.json(products);
};

/**
 * GET PRODUCT BY ID
 */
export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findOne({
    where: { id: req.params.id },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json(product);
};

/**
 * UPDATE PRODUCT
 */
export const updateProduct = async (req: Request, res: Response) => {
  const product = await Product.findOne({
    where: { id: req.params.id },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const dto = plainToInstance(UpdateProductDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  Object.assign(product, dto);
  await product.save();

  return res.json(product);
};

/**
 * DELETE PRODUCT (hard delete)
 */
export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findOne({
    where: { id: req.params.id },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.remove();
  return res.status(204).send();
};
