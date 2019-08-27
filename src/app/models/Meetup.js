import Sequelize, { Model } from 'sequelize';
import { isBefore, subDays } from 'date-fns';

class Meetup extends Model {
  static init(sequelize) {
    super.init({
      title: Sequelize.STRING,
      description: Sequelize.STRING,
      location: Sequelize.STRING,
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE,
      past: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(this.date, new Date());
        },
      },
      cancelable: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(new Date(), subDays(this.date, 7));
        },
      },
    });
  }

  static associations(models) {
    this.hasMany(models.Subscription, { foreignKey: 'meetup_id' });
    this.belongsTo(models.File, { foreignKey: 'file_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Meetup;
