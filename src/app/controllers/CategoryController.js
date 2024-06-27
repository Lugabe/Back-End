import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';
import { where } from 'sequelize';
import Products from '../models/Products';

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
    const { filename: path } = request.file;

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
      path,
    });

    return response.status(201).json({ id, name, path });
  }

  async updateCategory(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
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
    const { id } = request.params;

    let path;
    if (request.file) {
      path = request.file.filename;
    }

    if (!name && !path) {
      return response.status(200).json('No updates made');
    }

    try {
      const categoryIdExist = await Category.findByPk(id);
      if (!categoryIdExist) {
        return response.status(400).json("Category ID don't exist");
      }
    } catch (error) {
      return response.status(400).json(error);
    }

    try {
      if (path && !name) {
        await Category.update(
          {
            path,
          },
          {
            where: { id },
          },
        );
        return response.status(200).json('Image Updated');
      }
    } catch (error) {
      return response.status(200).json({ error });
    }

    try {
      const categoryAlreadyExist = await Category.findOne({
        where: {
          name,
        },
      });

      if (categoryAlreadyExist && categoryAlreadyExist.id != id) {
        return response.status(400).json({ error: 'Category already exist' });
      }
    } catch (error) {
      return response.status(400).json({ error });
    }

    try {
      await Category.update(
        {
          name,
          path,
        },
        {
          where: {
            id,
          },
        },
      );

      return response.status(200).json({ id, name, path });
    } catch (error) {
      return response.status(400).json({ error });
    }
  }

  async deleteCategory(request, response) {
    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { id } = request.params;

    const categoryIdExist = await Category.findByPk(id);
    if (!categoryIdExist) {
      return response.status(400).json("Category ID don't exist");
    }

    const categoryName = categoryIdExist.name;

    try {
      await Category.destroy({
        where: {
          id,
        },
      });
      return response.status(200).json(`${categoryName} Was Deleted`);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async index(request, response) {
    const categories = await Category.findAll();

    // console.log({ userId: request.userId });

    return response.json(categories);
  }
}

export default new CategoryController();
