import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';
import { where } from 'sequelize';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
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

    const { name } = request.body;

    const categoryAlreadyExist = await Category.findOne({
      where: {
        name,
      },
    });

    if (categoryAlreadyExist) {
      return response.status(400).json({ error: 'Category already exist' });
    }

    const { id } = await Category.create({
      name,
    });

    return response.status(201).json({ id, name });
  }

  async updateCategory(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
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
    const { name } = request.body;

    try {
      const categoryAlreadyExist = await Category.findOne({
        where: {
          name,
        },
      });

      if (categoryAlreadyExist) {
        return response.status(400).json({ error: 'Category already exist' });
      }
    } catch (error) {
      return response.status(400).json({ error });
    }

    try {
      await Category.update(
        {
          name,
        },
        {
          where: {
            id,
          },
        },
      );

      return response.status(200).json({ id, name });
    } catch (error) {
      return response.status(400).json({ error });
    }
  }

  async index(request, response) {
    const categories = await Category.findAll();

    // console.log({ userId: request.userId });

    return response.json(categories);
  }
}

export default new CategoryController();
