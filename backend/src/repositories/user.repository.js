import prisma from '../config/prisma.js';

export const findUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

export const findUserByGithubId = async (githubId) => {
  return prisma.user.findUnique({ where: { githubId } });
};

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data) => {
  return prisma.user.create({ data });
};

export const updateUser = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};
