export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Token",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      familyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      indexes: [
        { fields: ["userId"] },
        { fields: ["familyId"] },
        { fields: ["expires_at"] },
      ],
    },
  );
};
