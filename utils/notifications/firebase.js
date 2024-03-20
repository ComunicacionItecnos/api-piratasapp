const admin = require('firebase-admin');

// Inicializa la aplicación con tus credenciales de Firebase
const serviceAccount = require('../../config/serviceAccountKey');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
