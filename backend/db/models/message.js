'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {

    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },

  }, {});
  Message.associate = function(models) {
    // associations can be defined here
    Message.belongsTo(models.User, {foreignKey: 'userId'})
  };
  return Message;
};
