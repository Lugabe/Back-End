import * as Yup from 'yup';
import Category from '../models/Category';
import Product from '../models/Products';
import Order from '../schemas/Order';
import Database from '../../database/index';
import { where } from 'sequelize';
import { response } from 'express';
import { throws } from 'assert';
import { error } from 'console';
import User from '../models/User';

class OrderController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { products } = request.body;

    const productsIds = products.map((product) => product.id);

    const findProduct = await Product.findAll({
      where: {
        id: productsIds,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    const formattedProduct = findProduct.map((product) => {
      const productIndex = products.findIndex((item) => item.id === product.id);

      const newProduct = {
        id: product.id,
        name: product.name,
        category: product.category.name,
        price: product.price,
        url: product.url,
        quantity: products[productIndex].quantity,
      };

      return newProduct;
    });

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: formattedProduct,
      status: 'Pedido Realizado',
    };

    try {
      const createdOrder = await Order.create(order);
      console.log('Order inserted with Success:', createdOrder._id);
      return response.status(201).json(createdOrder);
    } catch (error) {
      return response
        .status(500)
        .json({ error: 'Error in create order', error });
    }
  }

  async index(request, response) {
    const findAllOrders = await Order.find();

    // console.log({ userId: request.userId });

    return response.json(findAllOrders);
  }

  async updateOrderStatus(request, response) {
    const schema = Yup.object({
      status: Yup.string().required(),
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
    const { status } = request.body;

    if (typeof status !== 'string') {
      return response.status(400).json('Status must be String');
    }

    try {
      await Order.updateOne({ _id: id }, { status });

      return response.status(200).json(`Status alterado para:  **${status}**`);
    } catch (error) {
      return response
        .status(500)
        .json(
          `Error in update the order, order id not exist: ${error.message}`,
        );
    }
  }
}

export default new OrderController();
