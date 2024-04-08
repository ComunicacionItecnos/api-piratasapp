const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    nickname: { type: String, unique: true },
    name: String,
    lastname: String,
    motherlastname: String,
    email: { type: String, unique: true },
    password: String,
    phonecode: {
      code: String,
      dial_code: String,
      flag: String,
      name: String,
    },
    phone: { type: String, unique: true },
    country: String,
    state: String,
    city: String,
    sex: String,
    age: Number,
    image: String,
    member: {
      idMember: { type: mongoose.Schema.Types.ObjectId, ref: 'members' },
      dateUpdate: Date,
      endDay: Date,
      active: Boolean,
      userEdit: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'roles' }],
    status: [
      {
        name: String,
        value: Boolean,
        userEdit: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      },
    ],
    // Este campo solo se usa especificamente para saber a que tienda pertenece el empleado en caso de que tenga el rol de empleado(food, market) de alguna tienda
    stores: {
      food: [
        {
          value: Boolean,
          store: { type: mongoose.Schema.Types.ObjectId, ref: 'storesfood' },
          userEdit: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        },
      ],
      market: [
        {
          value: Boolean,
          store: { type: mongoose.Schema.Types.ObjectId, ref: 'stores' },
          userEdit: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        },
      ],
    },
  },
  { timestamps: true },
);

userSchema.add({
  notificationToken: { type: String, default: '' },
  termsAndConditions: { type: Boolean, default: false },
});

module.exports = mongoose.model('user', userSchema);
