import { Chain } from "viem/chains";
import {
  WalletClient,
  PublicClient,
  createWalletClient,
  http,
  createPublicClient,
  formatEther,
  SignTypedDataParameters,
  SignTransactionParameters,
  parseEther,
  getContract,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mnemonicToPrivateKey, privateKeyToMnemonic } from "@tiduswallet/utils";
import { SendTxParameterType } from "./types";

export default class EVMService {
  constructor(blockchain: Chain) {
    this.blockchain = blockchain;
    this.provider = createPublicClient({
      chain: blockchain,
      transport: http(),
    });
  }

  blockchain: Chain;
  wallet: WalletClient | undefined;
  provider: PublicClient;
  mnemonic: string | undefined;
  privateKey: string | undefined;

  get address() {
    return this.wallet?.account?.address;
  }

  createFromMnemonic(mnemonic: string, accountIndex: number = 0) {
    this.mnemonic = mnemonic;
    const privateKey = mnemonicToPrivateKey(mnemonic, "EVM", accountIndex);
    return this.createFromPrivateKey(privateKey);
  }

  createFromPrivateKey(privateKey: string) {
    this.privateKey = privateKey;

    if (!this.mnemonic) {
      this.mnemonic = privateKeyToMnemonic(privateKey);
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`);
    this.wallet = createWalletClient({
      account,
      chain: this.blockchain,
      transport: http(),
    });
    return this;
  }

  async getBalance(
    inWei?: boolean,
    address?: string,
  ): Promise<number | bigint> {
    let _address: string;

    if (address) {
      _address = address;
    } else if (this.wallet?.account) {
      _address = this.wallet.account.address;
    } else return 0;

    const wei = await this.provider.getBalance({
      address: _address as `0x${string}`,
    });

    return inWei ? wei : parseFloat(formatEther(wei));
  }

  async signTransaction(transaction: SignTransactionParameters) {
    if (!this.wallet) {
      throw new Error("Wallet not created");
    }

    return await this.wallet?.signTransaction(transaction);
  }

  async signMessage(message: string) {
    if (!this.wallet) {
      throw new Error("Wallet not created");
    }

    return await this.wallet?.signMessage({
      account: this.wallet!.account!.address,
      message,
    });
  }

  async signTypedData(typedData: SignTypedDataParameters) {
    if (!this.wallet) {
      throw new Error("Wallet not created");
    }

    return await this.wallet?.signTypedData(typedData);
  }

  async sendTransaction(transaction: SendTxParameterType) {
    if (!this.wallet) {
      throw new Error("Wallet not created");
    }

    return await this.wallet?.sendTransaction(transaction);
  }

  async sendEthers(
    to: string,
    value: number,
    options?: {
      waitForReceipt?: boolean;
    },
    nonce?: number,
  ) {
    try {
      if (!this.wallet) {
        throw new Error("Wallet not created");
      }

      const tx: SendTxParameterType = {
        value: parseEther(value.toString()),
        to: to as `0x${string}`,
        account: this.wallet.account!.address,
        chain: this.blockchain,
        from: this.wallet.account!.address,
        nonce: nonce,
      };

      if (options?.waitForReceipt) {
        const txHash = await this.wallet?.sendTransaction(tx);
        if (!txHash) return;
        const receipt = await this.provider.waitForTransactionReceipt({
          hash: txHash,
        });
        return receipt;
      }

      return await this.wallet?.sendTransaction(tx);
    } catch (error) {
      throw error;
    }
  }

  async sendToken(
    to: string,
    value: number,
    tokenAddress: string,
    options?: {
      waitForReceipt?: boolean;
    },
  ) {
    try {
      if (!this.wallet) {
        throw new Error("Wallet not created");
      }

      const contract = getContract({
        address: tokenAddress as `0x${string}`,
        abi: ["function transfer(address,uint256)", "function decimals()"],
        client: this.wallet,
      });

      const decimals = (await contract.read.decimals()) as number;
      const formattedValue = parseUnits(
        value.toString(),
        parseFloat(decimals.toString()),
      );
      const txHash = await contract.write.transfer([to, formattedValue]);

      if (options?.waitForReceipt) {
        if (!txHash) return;
        const receipt = await this.provider.waitForTransactionReceipt({
          hash: txHash,
        });
        return receipt;
      }

      return txHash;
    } catch (error) {
      throw error;
    }
  }
}
