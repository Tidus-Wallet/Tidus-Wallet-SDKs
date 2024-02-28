import { blockchain, blockchainToCoinType } from "./types";
import * as bip32 from "bip32";
import bip39 from "bip39";
import base58 from "bs58";
import nacl from "tweetnacl";
import * as ed25519 from "ed25519-hd-key";

export function mnemonicToPrivateKey(
  mnemonic: string,
  chain: blockchain,
  accountIndex = 0,
) {
  if (chain === "Solana") {
    return mnemonicToPrivateKeySolana(mnemonic, accountIndex);
  }

  const path = `m/44'/${blockchainToCoinType(chain)}'/${accountIndex}'/0/0`;

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic");
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);
  root.derivePath(path).toBase58();
  const keyPair = root.derivePath(path);

  let privateKey;

  if (chain === "Bitcoin") {
    privateKey = keyPair.toWIF();
  } else {
    privateKey = `0x${keyPair.privateKey?.toString("hex")}`;
  }

  if (!privateKey) {
    throw new Error("Private key not found");
  }

  return privateKey;
}

function mnemonicToPrivateKeySolana(mnemonic: string, accountIndex: number) {
  const path = `m/44'/501'/${accountIndex}'/0'`;
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const derivedSeed = ed25519.derivePath(path, seed.toString("hex")).key;
  const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
  return base58.encode(keyPair.secretKey);
}
