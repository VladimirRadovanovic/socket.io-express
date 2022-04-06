'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        privateChatRoomID: uuidv4()
      },
      {
        email: 'test@test.com',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password'),
        privateChatRoomID: uuidv4()
      },
      {
        email: 'test1@test.com',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password'),
        privateChatRoomID: uuidv4()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
