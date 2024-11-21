let port = 3000;

module.exports = {
  app: {
    mode: "development",
    port,
    websocketport: 0, // 0 to disable
    severhost: "http://localhost:" + port,
  },
  db: {
    sequelize: {
      database: "coelhojs",
      username: "root",
      options: {
        host: "localhost",
        dialect: "mysql",
      },
    },
  },
};
