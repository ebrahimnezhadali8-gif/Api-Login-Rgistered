export default (sequelize, DataTypes) => {
  return sequelize.define("Token", {
    id: { type: DataTypes.STRING(40), primaryKey: true },
    userId: DataTypes.STRING(40),
    token: DataTypes.STRING,
    expires_at: DataTypes.DATE,
  });
};
