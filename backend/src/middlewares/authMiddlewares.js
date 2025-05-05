import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token inválido.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token mal formatado.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt_config.secret);

    req.user = {
      id: decoded.id,
      username: decoded.username,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};
