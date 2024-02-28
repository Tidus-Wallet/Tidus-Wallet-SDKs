import { Chain } from "viem/chains";
import {
  WalletClient,
  PublicClient,
  createWalletClient,
  http,
  createPublicClient,
  formatEther,
} from "viem";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";

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

  get getAddress() {
    return this.wallet?.account?.address;
  }

  createFromMnemonic(mnemonic: string, accountIndex: number = 0) {
    this.mnemonic = mnemonic;
    const account = mnemonicToAccount(mnemonic, { accountIndex: accountIndex });
    this.wallet = createWalletClient({
      account,
      chain: this.blockchain,
      transport: http(),
    });
  }

  createFromPrivateKey(privateKey: string) {
    this.privateKey = privateKey;
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    this.wallet = createWalletClient({
      account,
      chain: this.blockchain,
      transport: http(),
    });
  }

  get getPrivateKey() {
    return this.privateKey;
  }

  getMnemonic() {
    return this.mnemonic;
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
}
