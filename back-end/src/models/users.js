export default (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      id: { type: DataTypes.STRING(40), primaryKey: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      phone: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
      password: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      timestamps: false
    },
  );
};
