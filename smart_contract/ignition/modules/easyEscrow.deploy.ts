// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EasyEscrow = buildModule("EasyEscrow", (m) => {

  const deploy = m.contract("EasyEscrow");

  return { deploy };
});

export default EasyEscrow;
