import Sequelize, { Model } from 'sequelize';
import { resolve } from 'path';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        // url: {
        //   type: Sequelize.VIRTUAL,
        //   get() {
        //     return ``;
        //   },
        // },
      },
      {
        sequelize,
      }
    );
  }
}

export default File;
