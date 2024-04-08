const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const config = require('../../../config/config');
const UserService = require('../../../services/user.service');
const service = new UserService();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

const jwtStrategy = new Strategy(opts, async (jwt_payload, done) => {
  const user = await service.getProfile(jwt_payload.sub);

  //console.log('user', user);

  if (!user) {
    done(boom.unauthorized(), false);
  }

  return done(null, jwt_payload);
});

module.exports = jwtStrategy;
