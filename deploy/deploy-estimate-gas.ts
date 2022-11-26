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
  const artifactSimpleNFT = await deployer.loadArtifact("MyNFTSimple");
  const artifactERC20 = await deployer.loadArtifact("MyToken");
  const artifactERC20Simple = await deployer.loadArtifact("MyTokenSimple");
  const artifactSimpler = await deployer.loadArtifact("Simpler");
  const artifactDisperse = await deployer.loadArtifact("Disperse");

  const collection_name = "Cats & dogs"
  const token_name = "CAD"

  const deploymentFee = await deployer.estimateDeployFee(artifact, [collection_name, token_name, uri]);
  const deploymentFeeSimpleNFT = await deployer.estimateDeployFee(artifactSimpleNFT, [collection_name, token_name]);
  const deploymentFeeERC20 = await deployer.estimateDeployFee(artifactERC20, [collection_name, token_name]);
  const deploymentFeeERC20Simple = await deployer.estimateDeployFee(artifactERC20Simple, [collection_name, token_name]);
  const deploymentFeeSimpler = await deployer.estimateDeployFee(artifactSimpler, ["greeting"]);
  const deploymentDisperse = await deployer.estimateDeployFee(artifactDisperse, []);

  // Estimate fee for each contract
  console.log(`The deployment NFT contract is estimated to cost ${ethers.utils.formatEther(deploymentFee.toString())} ETH --script deploy/deploy-nft.ts`);
  console.log(`The deployment NFT simple contract is estimated to cost ${ethers.utils.formatEther(deploymentFeeSimpleNFT.toString())} ETH --script deploy/deploy-nft-simple.ts`);
  console.log(`The deployment ERC20 contract is estimated to cost ${ethers.utils.formatEther(deploymentFeeERC20.toString())} ETH --script deploy/deploy-erc20.ts`);
  console.log(`The deployment ERC20 simple contract is estimated to cost ${ethers.utils.formatEther(deploymentFeeERC20Simple.toString())} ETH --script deploy/deploy-erc20-simple.ts`);
  console.log(`The deployment Simpler contract is estimated to cost ${ethers.utils.formatEther(deploymentFeeSimpler.toString())} ETH --script deploy/deploy-simpler.ts`);
  console.log(`The deployment Disperser contract is estimated to cost ${ethers.utils.formatEther(deploymentDisperse.toString())} ETH --script deploy/deploy-disperser.ts`);



  
}
