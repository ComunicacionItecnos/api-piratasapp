const boom = require('@hapi/boom');
const { Strategy } = require('passport-local');

const UserService = require('../../../services/user.service');
const service = new UserService();

const LocalStrategy = new Strategy(async (username, password, done) => {
  try {
    // const userFinded = await service.getProfile('23232');

    if (!username) {
      return done(boom.unauthorized(), false);
    }

    done(null, { name: 'Bryan' });
  } catch (err) {
    done(err, false);
  }
});

module.exports = LocalStrategy;
