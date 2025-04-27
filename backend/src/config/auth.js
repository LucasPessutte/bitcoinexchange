// src/config/auth.js
import dotenv from 'dotenv';

dotenv.config();

export default {
  secret: process.env.JWT_SECRET || 'supersecretjwtkey',
  expiresIn: '7d',
};