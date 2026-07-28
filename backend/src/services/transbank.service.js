const {
  WebpayPlus,
  Options,
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Environment,
} = require('transbank-sdk');

function construirOpciones() {
  const commerceCode = process.env.TBK_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
  const apiKey = process.env.TBK_API_KEY || IntegrationApiKeys.WEBPAY;
  const environment = process.env.TBK_ENVIRONMENT === 'production' ? Environment.Production : Environment.Integration;
  return new Options(commerceCode, apiKey, environment);
}

function nuevaTransaccion() {
  return new WebpayPlus.Transaction(construirOpciones());
}

async function iniciarTransaccion({ buyOrder, sessionId, amount, returnUrl }) {
  const tx = nuevaTransaccion();
  return tx.create(buyOrder, sessionId, amount, returnUrl);
}

async function confirmarTransaccion(token) {
  const tx = nuevaTransaccion();
  return tx.commit(token);
}

module.exports = { iniciarTransaccion, confirmarTransaccion };
