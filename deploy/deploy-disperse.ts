import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as dotenv from "dotenv";

export default async function (hre: HardhatRuntimeEnvironment) {
  dotenv.config();
  console.log(`Running deploy script for the desperse contract`);

  // Initialize the wallet.
  const wallet = new Wallet(process.env.PRIVATE_KEY as any);

  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Disperse");

  const token_desc = "simple swap finance token"
  const token_symbol = "SSF"

  const deploymentFee = await deployer.estimateDeployFee(artifact, []);

  // Deposit some funds to L2
  //const depositAmount = ethers.utils.parseEther("0.25");
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);


  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: deploymentFee,
  });
  await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  const thistleContract = await deployer.deploy(artifact, []);


  //obtain the Constructor Arguments
  console.log("constructor args:" + thistleContract.interface.encodeDeploy([]));

  await thistleContract.deployed();

  // Show the contract info.
  const contractAddress = thistleContract.address;
  console.log("");
  console.log(`Contract was deployed to ${contractAddress} 🎉 `);
  console.log(`Deployer ${await deployer.zkWallet.getAddress()}`);
}