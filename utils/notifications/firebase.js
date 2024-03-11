const admin = require('firebase-admin');

// Inicializa la aplicación con tus credenciales de Firebase
var serviceAccount = require('../../config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
