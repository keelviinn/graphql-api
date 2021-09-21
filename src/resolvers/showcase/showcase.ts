import { ApolloError } from 'apollo-server-express';
import Showcase from '../../models/showcase/showcase.schema';

export const showcases = async  (parent: any, args: any, context: any) => {
  try {
    const showcases = await Showcase.find().populate('products');
    return { list: showcases }    
  } catch (error) { 
    console.error(error); 
    throw new ApolloError('Error to find this showcases list!'); 
  }
};

export const showcase = async (parent: any, args: any, context: any) => {
  try {
    return await Showcase.findById(args._id);
  } catch (error) { 
    console.error(error); 
    throw new ApolloError('Error to find this current product!'); 
  } 
};

export const addShowcase = async (parent: any, args: any, context: any) => {
  try {    
    const newProduct = new Showcase({...args});
    await newProduct.save()
    return newProduct
  } catch (error) { 
    console.error(error); 
    throw new ApolloError('Error to add a new product!'); 
  }
};

export const updateShowcase = async (parent: any, args: any, context: any) => {
  try {
    let showcase: any = await Showcase.findById(args._id); 
    if (!showcase) throw new Error("Documento não encontrado!");
    let hasChange = Object.keys(args).some(arg => showcase[arg] !== arg[args] );
    if (hasChange) { for (let arg in args) { showcase[arg] = args[arg] } };
    await showcase.save();
    return showcase;    
  } catch (error) { 
    console.error(error); 
    throw new ApolloError('Error to update this current product!'); 
  }  
};

export const removeShowcase = async (parent: any, args: any, context:any) => {
  try {
    await Showcase.findByIdAndRemove(args._id);
    return true    
  } catch (error) { 
    console.error(error); 
    throw new ApolloError('Error to remove the current product!'); 
  }  
};

export const showcaseQueries = { showcases, showcase };
export const showcaseMutations = { addShowcase, updateShowcase, removeShowcase };
