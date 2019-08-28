import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {
        canceled_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        canceleble: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Subscription;
