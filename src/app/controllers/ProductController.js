import * as Yup from 'yup';
import Products from '../models/Products';
import Category from '../models/Category';
import User from '../models/User';
import { where } from 'sequelize';

class ProductsController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { filename: path } = request.file;
    const { name, price, category_id, offer } = request.body;

    try {
      const productNameAlreadyExist = await Products.findOne({
        where: {
          name,
        },
      });

      if (productNameAlreadyExist) {
        return response
          .status(400)
          .json('Not can be registred with some name of product already exist');
      }
    } catch (error) {
      return response.status(400).json({ error });
    }

    const product = await Products.create({
      name,
      price,
      category_id,
      path,
      offer,
    });

    return response.status(201).json(product);
  }

  async updateProduct(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      offer: Yup.boolean(),
      category_id: Yup.number(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { id } = request.params;

    const findProduct = await Products.findByPk(id);
    if (!findProduct) {
      response.status(400).json({ error: 'Product id not Exist' });
    }

    let path;
    if (request.file) {
      path = request.file.filename;
    }

    const { name, price, offer, category_id } = request.body;

    try {
      await Products.update(
        {
          name,
          price,
          category_id,
          path,
          offer,
        },
        {
          where: {
            id,
          },
        },
      );
      response.status(200).json('Product Updated');
    } catch (error) {
      response.status(400).json({ error });
    }
  }

  async deleteProduct(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      offer: Yup.boolean(),
      category_id: Yup.number(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { id } = request.params;

    const findProduct = await Products.findByPk(id);
    if (!findProduct) {
      response.status(400).json({ error: 'Product id not Exist' });
    }

    console.log(id);

    try {
      await Products.destroy({
        where: {
          id,
        },
      });
      response.status(200).json('Product Deleted. ID: ' + id);
    } catch (error) {
      response.status(400).json({ error });
    }
  }

  async index(request, response) {
    const products = await Products.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    // console.log({ userId: request.userId });

    return response.json(products);
  }
}

export default new ProductsController();
