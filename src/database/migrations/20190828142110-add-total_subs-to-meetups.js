module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('meetups', 'total_subs', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('meetups', 'total_subs');
  },
};
