import * as Yup from 'yup';
import User from '../models/User';
import jwt from 'jsonwebtoken'

class SessionController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(request.body);

    const emailOrPasswordIncorrect = () => {
      return response
        .status(401)
        .json({ error: 'Make sure your email or password is correct' });
    };

    if (!isValid) {
      return emailOrPasswordIncorrect()
    }

    const { email, password } = request.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return emailOrPasswordIncorrect();
    }

    const isSamePassword = await user.checkPassword(password);

    if (!isSamePassword) {
      return emailOrPasswordIncorrect();
    }

    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: email,
      admin: user.admin,
      token: jwt.sign({id: user.id},'ce61649168c4550c2f7acab92354dc6e',{
        expiresIn: '5d'
      })
    });
  }
}

export default new SessionController();
