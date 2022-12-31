const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');
const path = require('path');


const VPN_USERS_DB = "wireguard_users.sql"

const getVpnUsers = () => new sqlite3.Database(VPN_USERS_DB);

const initDb = () => {
  const vpnUsers = getVpnUsers();
  if (fs.existsSync(VPN_USERS_DB)) {
      console.log("Database already initialized.");
  } else {
      console.log("Initialize database.");
    vpnUsers.serialize(() => {
        vpnUsers.run("CREATE TABLE wireguard_users (vpn_pubkey TEXT, invoice TEXT, amount INT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, ends_at DATETIME, subnet TEXT)");
    });
  }
  // vpnUsers.close();
};

const addUser = (vpnPubKey, invoice, amount, subnet, endsAt) => {
    const vpnUsers = getVpnUsers();
    // TODO: add ending time
    console.log('Ends after: ', endsAt)
    const stmt = vpnUsers.run(`INSERT INTO wireguard_users VALUES (${vpnPubKey} ${invoice} ${amount} ${subnet})`)
    vpnUsers.close();
}

const getLastIpAddress = () => {
    const vpnUsers = getVpnUsers();
    const lastUser = vpnUsers.each("SELECT * from wireguard_users ORDER BY subnet LIMIT 1");
    vpnUsers.close();
    console.log('LAST USER ', lastUser)
    return lastUser.subnet;
}

initDb();

module.exports = {
    addUser
};
