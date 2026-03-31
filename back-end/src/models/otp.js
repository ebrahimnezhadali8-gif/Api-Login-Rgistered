export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Otp",
    {
      phone: { type: DataTypes.STRING(20), allowNull: false },
      code: { type: DataTypes.STRING(255), allowNull: false },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      type: {
        type: DataTypes.ENUM("login", "register", "fogot"),
        allowNull: false,
      },
      used_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      timestamps: false,
    },
  );
};
