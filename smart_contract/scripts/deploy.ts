// import { ethers } from 'hardhat';

// async function main() {
//   const [deployer] = await ethers.getSigners();

//   const token = await ethers.getContractFactory('EasyEscrow');
//   const factory = await token.deploy();
//   console.log('Token address:', await factory.getAddress());
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });


const { ethers } = require("hardhat");

async function main() {

  const deployerAddr = "0xf71d4Db6327AD788AB372E5146E1e90bC07338f3";
  const deployer = await ethers.getSigner(deployerAddr);

  console.log(`Deploying contracts with the account: ${deployer.address}`);
  console.log(`Account balance: ${(await deployer.provider.getBalance(deployerAddr)).toString()}`);


  const sbtContract = await ethers.deployContract("EasyEscrow");
  await sbtContract.waitForDeployment();

console.log(`Congratulations! You have just successfully deployed your soul bound tokens.`);
console.log(`SBT contract address is ${sbtContract.target}. You can verify on https://kairos.kaiascope.com/account/${sbtContract.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
