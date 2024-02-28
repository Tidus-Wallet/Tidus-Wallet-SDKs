import { mnemonicToPrivateKey } from "./";
import { strictEqual } from "assert";

const mnemonic =
  "place original brush rate original guitar pair feature pig man zoo tide";

describe("mnemonicToPrivateKey", () => {
  it("should return an EVM private key", () => {
    const chain = "EVM";
    const accountIndex = 0;
    const privateKey = mnemonicToPrivateKey(mnemonic, chain, accountIndex);
    strictEqual(
      privateKey,
      "0x0a1e99aecc3bd859b0bd96757e1bf36ec2d274d6f0e4774083bed4f0541450a8",
    );
  });

  it("should return a Bitcoin private key", () => {
    const chain = "Bitcoin";
    const accountIndex = 0;
    const privateKey = mnemonicToPrivateKey(mnemonic, chain, accountIndex);
    strictEqual(
      privateKey,
      "KwzjHqQesFuXXyaLFp3SnwiPQELzvgiQZW7BkJQoHHeAgUpnGDua",
    );
  });

  it("should return a Solana private key", () => {
    const chain = "Solana";
    const accountIndex = 0;
    const privateKey = mnemonicToPrivateKey(mnemonic, chain, accountIndex);
    strictEqual(
      privateKey,
      "4bHYfPH6gKPgBi2Z7kVrbevhkPC4FnUuBAm4Bt9GxfqAht4noH4aEhWA5ZmNfLVhhgjdPZB6gx1XvSNbkRaTpykw",
    );
  });
});
