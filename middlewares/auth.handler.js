const UserService = require('../services/user.service');
const service = new UserService();

const handleAuthentication = (err, req, res) => {
  console.log('handleAuthentication');

  //   const user = await service.getProfile(req.user.sub);

  //   if (!user._id) {
  //     res.status(401).json({ message: 'Unauthorized' });
  //   }

  //   next(err);
};

module.exports = { handleAuthentication };
