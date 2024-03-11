const admin = require('firebase-admin');

// Función para enviar una notificación push
function sendNotification(registrationToken, payload) {
  admin
    .messaging()
    .sendToDevice(registrationToken, payload)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

module.exports = { sendNotification };
