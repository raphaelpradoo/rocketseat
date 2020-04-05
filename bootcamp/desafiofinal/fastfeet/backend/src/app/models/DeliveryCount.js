import Sequelize, { Model } from 'sequelize';

class DeliveryCount extends Model {
  static init(sequelize) {
    super.init(
      {
        delivery_date: Sequelize.DATE,
        count: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    // Relacionamento entre as Models de Contagem da Entrega e Entregador
    this.belongsTo(models.Delivery, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
  }
}

export default DeliveryCount;
