import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as dotenv from "dotenv";
import { Web3Storage, Blob, File, getFilesFromPath } from "web3.storage";

export default async function (hre: HardhatRuntimeEnvironment) {
  dotenv.config();
  console.log(`Running deploy script for the NFT contract`);

  function getAccessToken() {
    console.log("✅ getAccessToken");
    return process.env.WEB3STORAGE_TOKEN;
  }

  function makeStorageClient() {
    console.log("✅ makeStorageClient");
    return new Web3Storage({ token: getAccessToken() } as any);
  }

  function makeFileObjects(uri_images) {
    console.log("✅ makeFileObjects");
    const metadata = {
        "name": "A2",
        "author": "A2",
        "description":"A2",
        "image": "https://ipfs.io/ipfs/"+uri_images+"/images/image1.jpg",
        "license": "CC0 1.0 Universal"
    }
    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });

    const files = [
      new File([blob], "metadata.json"),
    ];
    return files;
  }

  async function storeFiles(files) {
    console.log("✅ storeFiles");
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log("✅ stored files with CID: ", cid, "🎉");
    return cid;
  }

  async function storeImages() {
    const client = makeStorageClient();
    const images = await getFilesFromPath('images/')
    const cid_img = await client.put(images);
    console.log("✅ stored image with CID: ", cid_img, "🎉");
    return cid_img;
  }

  console.log("👋 Hello! ");
  const uri_images = (await storeImages()) ;
  const uri = (await storeFiles(makeFileObjects(uri_images))) + "/metadata.json";
  
  console.log("✅ uri: ", uri);
  console.log("✅ uri images: ", uri_images);


  // Initialize the wallet.
  const wallet = new Wallet(process.env.PRIVATE_KEY as any);

  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("MyNFT");

  const collection_name = "Cats & dogs"
  const token_name = "CAD"

  const deploymentFee = await deployer.estimateDeployFee(artifact, [collection_name, token_name, uri]);

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
  const thistleContract = await deployer.deploy(artifact, [collection_name, token_name, uri]);


  //obtain the Constructor Arguments
  console.log("constructor args:" + thistleContract.interface.encodeDeploy([collection_name, token_name, uri]));

  await thistleContract.deployed();

  // Show the contract info.
  const contractAddress = thistleContract.address;
  console.log("");
  console.log(`Contract was deployed to ${contractAddress} 🎉 `);
  console.log(`Deployer ${await deployer.zkWallet.getAddress()}`);
  console.log("");
  console.log("mint 1st nft from contract: ", await thistleContract.safeMint(await deployer.zkWallet.getAddress()));
}
