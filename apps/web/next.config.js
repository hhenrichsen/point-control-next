const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

const prismaPlugin = new PrismaPlugin();

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, prismaPlugin];
    }
    return config;
  },
};
