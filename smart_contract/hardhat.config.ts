import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const baobab_rpc = process.env.KAIROS_TESTNET_URL;

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    kairos: {
      url: baobab_rpc,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      }
    }
  }
};

export default config;
