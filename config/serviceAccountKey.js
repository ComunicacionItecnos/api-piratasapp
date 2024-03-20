const config = require('../config/config');

module.exports = {
  type: 'service_account',
  project_id: 'galeon-39232',
  private_key_id: config.privateKeyIdFirebase,
  private_key: config.privateKeyFirebase,
  client_email: 'firebase-adminsdk-3p93t@galeon-39232.iam.gserviceaccount.com',
  client_id: '116260466954616811397',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3p93t%40galeon-39232.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
