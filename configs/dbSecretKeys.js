process.env.NODE_ENV === 'production'
    ? (module.exports = require('./dbSecretKeysProd'))
    : (module.exports = require('./dbSecretKeysDev'))
