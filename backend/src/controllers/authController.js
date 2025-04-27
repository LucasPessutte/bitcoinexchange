// src/controllers/authController.js
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';
import db from '../models/index.js';

const UserModel = db.User;

// Função para gerar o token JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    authConfig.secret,
    { expiresIn: authConfig.expiresIn }
  );
}

// Controller principal: login (e cadastro automático se não existir)
export const login = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username é obrigatório.' });
    }

    let user = await UserModel.findOne({ where: { username } });

    if (!user) {
      // Cria o usuário com saldo inicial se não existir
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
