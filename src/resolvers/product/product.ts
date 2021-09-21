import mongoose from 'mongoose';
import Product from '../../models/product/product.schema';
import Showcase from '../../models/showcase/showcase.schema';
import ShowcaseModel from '../../models/showcase/showcase.model';
import { ApolloError } from 'apollo-server-express';

export const products = async  (parent: any, args: any, context: any) => {
  // const { role } = verifyAuth(context.authorization) 
  // if (role !== 'user') throw new Error("Voce nao tem permissao");
  const products = await Product.find();
  return { list: products }    
};

export const product = async (parent: any, args: any, context: any) => {
  try {
    if (!args._id) throw new Error('Id must be provided.');
    return await Product.findById(args._id);
  } catch (error) { 
    console.error(error); 
    throw new ApolloError('Error to find this current product!'); 
  } 
};

export const addProduct = async (parent: any, args: any, context: any) => {
  try {
    const newProduct = new Product({...args});
    await newProduct.save()
    return newProduct
  } catch (error) { 
    console.error(error); 
    throw new ApolloError('Error to add a new product!'); 
  }
};

export const updateProduct = async (parent: any, args: any, context: any) => {
  try {
    let product: any = await Product.findById(args._id); 
    if (!product) throw new Error("Documento não encontrado!");
    let hasChange = Object.keys(args).some(arg => product[arg] !== arg[args] );
    if (hasChange) { for (let arg in args) { product[arg] = args[arg] } };
    await product.save();
    return product;    
  } catch (error) { 
    console.error(error); 
    throw new ApolloError('Error to update this current product!'); 
  }  
};

export const removeProduct = async (parent: any, args: any, context:any) => {
  try {
    const showcases = await Showcase.find({ products: { $elemMatch: {$eq: mongoose.Types.ObjectId(args._id) } } });
    showcases.forEach((document: ShowcaseModel) => {
      const index = document.products.findIndex((produto: any) => produto == args._id);
      if (index >= 0) {
        document.products.splice(index, 1);
        document.markModified('products');
        document.save();
      }
    });
    await Product.findByIdAndRemove(args._id);
    return true    
  } catch (error) { 
    console.error(error); 
    throw new ApolloError('Error to remove the current product!'); 
  }  
};

export const productQueries = { products, product };
export const productMutations = { addProduct, updateProduct, removeProduct };
