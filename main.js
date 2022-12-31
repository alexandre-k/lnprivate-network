const lnService = require("ln-service");
const fs = require('fs');
const path = require('path');
const nodeSocket = "127.0.0.1:10001"

const initNode = () => {
    const cert = fs.readFileSync(path.join(__dirname, '/node_cert.txt'));
    const macaroon = fs.readFileSync(path.join(__dirname, '/node_macaroon.txt'));
    const { lnd: node } = lnService.authenticatedLndGrpc({
        cert: new TextDecoder().decode(cert),
        macaroon: new TextDecoder().decode(macaroon),
        socket: nodeSocket
    });
    return node
}

const lnd = initNode();

try {
    lnService.getWalletInfo({ lnd }, (err, result) => {
        const nodeKey = result.public_key;
        console.log('Node key: ', nodeKey)
    });
} catch (err) {
    console.log('Failed to load node.');
}

