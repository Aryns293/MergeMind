import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../../repositories/user.repository.js';
import AppError from '../../utils/appError.js';
import { generateToken } from '../../utils/jwt.js';

export const registerService = async (email, password, name) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const newUser = await createUser({
    email,
    password: hashedPassword,
    name,
  });

  const token = generateToken(newUser.id);
  
  // Don't leak password back to controller
  newUser.password = undefined; 
  return { user: newUser, token };
};

export const loginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user || !user.password) {
    throw new AppError('Incorrect email or password', 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError('Incorrect email or password', 401);
  }

  const token = generateToken(user.id);
  
  user.password = undefined;
  return { user, token };
};
