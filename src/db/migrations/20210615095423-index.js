const { v4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('users', {
        id: {
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: v4(),
        },
        fname: Sequelize.DataTypes.STRING,
        lname: Sequelize.DataTypes.STRING,
        fname: Sequelize.DataTypes.STRING,
        email_verified: {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        email: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        token: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
        },
      })
      .then(() => {
        queryInterface
          .bulkInsert('users', [
            {
              fname: 'Kevin',
              lname: 'Lee',
              email: 'lee@gmail.com',
              password: 'pass',
              createdAt: '2020-10-10',
            },
          ])
          .then((res) => res);
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  },
};
