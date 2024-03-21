const admin = require('firebase-admin');

// Función para enviar una notificación push
function sendNotification(registrationToken, payload) {
  admin
    .messaging()
    .sendToDevice(registrationToken, payload)
    .then((response) => {})
    .catch((error) => {});
}

module.exports = { sendNotification };
