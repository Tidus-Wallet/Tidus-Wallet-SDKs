import { strictEqual } from "assert";
import EVMService, { chains } from "./";

const mnemonic =
  "place original brush rate original guitar pair feature pig man zoo tide";
const privateKey =
  "0x0a1e99aecc3bd859b0bd96757e1bf36ec2d274d6f0e4774083bed4f0541450a8";

const service = new EVMService(chains.mainnet);

describe("generate a wallet from mnemonic", () => {
  const wallet = service.createFromMnemonic(mnemonic);

  it("should generate a wallet", () => {
    strictEqual(wallet.address, "0x665c42Aa6910Db3d1bd02FC431a14ADf8Bb642A6");
  });

  it("should have a private key", () => {
    strictEqual(
      wallet.privateKey,
      "0x0a1e99aecc3bd859b0bd96757e1bf36ec2d274d6f0e4774083bed4f0541450a8",
    );
  });
});

describe("generate a wallet from private key", () => {
  const wallet = service.createFromPrivateKey(privateKey);

  it("should generate a wallet", () => {
    strictEqual(wallet.address, "0x665c42Aa6910Db3d1bd02FC431a14ADf8Bb642A6");
  });

  it("should have a mnemonic", () => {
    console.log(wallet.mnemonic);
  });

  it("should get balance", async () => {
    const balance = await wallet.getBalance();
    console.log(balance);
  });

  it("should get balance in wei", async () => {
    // the result here is suffixed with 'n' to indicate it's a bigint
    const balance = await wallet.getBalance(true);
    console.log(balance);
  });
});
