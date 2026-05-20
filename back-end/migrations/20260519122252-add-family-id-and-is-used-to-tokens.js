'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tokens', 'family_id', {
      type: Sequelize.UUID,
      allowNull: true, 
    });

    await queryInterface.addColumn('tokens', 'is_used', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tokens', 'family_id');
    await queryInterface.removeColumn('tokens', 'is_used');
  }
};
