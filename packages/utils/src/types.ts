export type blockchain = "Solana" | "EVM" | "Bitcoin";

export const blockchainToCoinType = (blockchain: blockchain) => {
  switch (blockchain) {
    case "Solana":
      return "501";
    case "EVM":
      return "60";
    case "Bitcoin":
      return "0";
  }
};
