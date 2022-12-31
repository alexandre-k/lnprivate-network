const path = require("path");
const { WgConfig } = require("wireguard-tools");

const SUBNET = [10, 0, 0, 0]

const TEST_IP = [10, 0, 0, 1]

const incrementIpAddr = (ipAddr) => {
    let ip = (ipAddr[0] << 24) | (ipAddr[1] << 16) | (ipAddr[2] << 8) | (ipAddr[3] << 0);
    ip++;
    return [ip >> 24 & 0xff, ip >> 16 & 0xff, ip >> 8 & 0xff, ip >> 0 & 0xff];
}


const generateWireguardConfig = async () => {
    // const newIpAddr = incrementIpAddr(TEST_IP)
    const newIpAddr = TEST_IP;
    console.log(newIpAddr)

    const filePath = path.join(__dirname, "/configs", `/${TEST_IP.join("_")}.conf`);

    const config = new WgConfig({
        wgInterface: { address: [newIpAddr] },
        filePath,
    });

    await config.generateKeys();
    await config.writeToFile();
    await config.up();
};


generateWireguardConfig()
