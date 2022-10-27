const { writeFileSync, readFileSync } = require("fs");
const { ethers } = require("ethers");

const url = "http://localhost:8545";
const secret = "5uper53cr3t";

(async () => {
  const provider = new ethers.providers.JsonRpcProvider(url);

  await writeFirstAccount(provider);

  const firstAccount = getFirstAccount();

  const unlocked = await unLockAccount(provider, firstAccount, secret);

  const newWallets = [];

  if (unlocked) {
    for (let i = 0; i <= 5; i++) {
      const { wallet, json } = newWallet(provider);

      newWallets.push(json);

      const transactionHash = await provider.send(
        "eth_sendTransaction",
        [
          {
            from: firstAccount,
            to: wallet.address,
            value: "0x56bc75e2d63100000"
          },
        ]
      );

      console.log("transactionHash is " + transactionHash);
    }

    writeFileSync("wallets.json", JSON.stringify(newWallets), "utf-8");
  }
})();

function newWallet(provider) {
  const wallet = ethers.Wallet.createRandom({ provider });

  const { publicKey, privateKey } = wallet._signingKey();

  const json = {
    address: wallet.address,
    publicKey,
    privateKey,
  };

  console.log(json);

  return { wallet, json };
}

async function getBalance(provider, address) {
  const balance = await provider.getBalance(address);
  const balanceInEth = ethers.utils.formatEther(balance);
  console.log(`balance: ${balanceInEth} ETH`);
  return balanceInEth;
}

async function writeFirstAccount(provider) {
  const accounts = await provider.listAccounts();
  writeFileSync("account", accounts[0], "utf-8");
}

function getFirstAccount() {
  return readFileSync("account", "utf-8").toString();
}

async function unLockAccount(provider, address, secret) {
  return provider.send("personal_unlockAccount", [address, secret]);
}
