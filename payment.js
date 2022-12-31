const { once } = require("events");
const {
    getInvoice,
    createInvoice,
    payViaPaymentRequest,
    subscribeToInvoice,
} = require("ln-service");
const { addUser } = require("./database");
const { delay } = require("./utils");


const generateInvoice = async (
  lnd = lnd,
  country = "japan",
  requestedTime = 86400,
  base_price = 0.1
) => {
  // Create a zero value invoice
  const invoice = await createInvoice({
    cltv_delta: 40,
    description: `Connection to LnVPN service. Connection country is {country}`,
    lnd,
    // expires_at
    mtokens: base_price * requested_time,
  });
  console.log("invoice: ", invoice);
  const sub = subscribeToInvoice({ id: invoice.id, lnd });
  const [subInvoice] = await once(sub, "invoice_updated");
  console.log("sub invoice: ", subInvoice);
  // payInvoice({lnd, request: invoice.request});
  var paid = false;
  var invoiceDetails = undefined;
  while (!paid) {
    await delay(2000);
    invoiceDetails = await getInvoice({ id: invoice.id, lnd });
    const isCanceled = invoiceDetails.is_canceled;
    const isConfirmed = invoiceDetails.is_confirmed;
    paid = isCanceled || isConfirmed;
    console.log(
      "Waiting for confirmation of ",
      invoice.id,
      " ln invoice req: ",
      invoice.request
    );
  }
    // TODO: generate
    const vpnPubKey = "vpn public key"
    const ipAddr = "10.0.0.1"
    addUser(vpnPubKey, invoice.request, invoice.mtokens, ipAddr, requestedTime)
  console.log("Result: ", invoiceDetails);
};

// generateInvoice(lnd);

const payInvoice = async ({ lnd, request }) => {
  try {
    return await payViaPaymentRequest({ lnd, request });
  } catch (err) {
    console.log("ERR: ", err);
  }
};

module.exports = {
    generateInvoice,
    payInvoice
}
