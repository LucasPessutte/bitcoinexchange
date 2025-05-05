import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import db from '../models/index.js';

const UserModel = db.User;

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    config.jwt_config.secret,
    { expiresIn: config.jwt_config.expiresIn }
  );
}

export const login = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username é obrigatório.' });
    }

    let user = await UserModel.findOne({ where: { username } });

    if (!user) {
      user = await UserModel.create({ username, usd_balance: 100000, btc_balance: 100 });
    }

    const token = generateToken(user);

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        usd_balance: user.usd_balance,
        btc_balance: user.btc_balance,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};
