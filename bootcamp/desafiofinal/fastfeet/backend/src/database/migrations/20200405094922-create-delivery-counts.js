module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('delivery_counts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      deliveryman_id: {
        type: Sequelize.INTEGER,
        references: { model: 'deliverymans', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      delivery_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('delivery_counts');
  },
};
