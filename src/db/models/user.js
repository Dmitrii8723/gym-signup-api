module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    fname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      createdAt: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      updatedAt: false,
      timestamps: false,
    },
  });
  return User;
};
