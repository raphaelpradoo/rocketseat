import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init (sequelize) {
    super.init({
      title: Sequelize.STRING,
      description: Sequelize.STRING,
      location: Sequelize.STRING,
      date: Sequelize.DATE,
      user_id: Sequelize.INTEGER,
      file_id: Sequelize.INTEGER
    },
    {
      sequelize,
    }
  );

    return this;
  }

  // Relacionamentos
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.File, { foreignKey: 'file_id', as: 'banner' });
  }
}

export default Meetup;
