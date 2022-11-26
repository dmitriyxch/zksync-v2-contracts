# zkSync Minter

Mints an NFT on zkSync v2 testnet.

sudo apt update
git clone https://github.com/tolyamog/zksync-minter-main

## Install

```
sh start.sh
```

## Use

create file .env
with such parameters

INFURA_PROJECT_ID=
PRIVATE_KEY=
WEB3STORAGE_TOKEN=

- Add one of your wallets' private key, your own [Infura](https://infura.io/) project ID and a [Web3.Storage](https://web3.storage/tokens/) API token in a `.env` file
- Make sure you have a handful of Goerli ETH in this wallet
- Deploy on zkSync v2 testnet:

```
yarn hardhat compile
yarn hardhat deploy-zksync
```


Estmate gas for all contracts
npx hardhat deploy-zksync --script deploy/deploy-estimate-gas.ts 


Deploy NFT contract
npx hardhat deploy-zksync --script deploy/deploy-nft.ts 

Main features: Mint and Fee mint nft

onlyOwner:
- safeMint(address to)
- multiSafeMint(address[] calldata to)

Anyone:
- freeMint(address to)


Deploy NFT simple contract, consumes less gas
npx hardhat deploy-zksync --script deploy/deploy-nft-simple.ts

Main features: 
- NO Owner !!!
- safeMint(address to, uint256 tokenId)

Deploy ERC20  contract
npx hardhat deploy-zksync --script deploy/deploy-erc20.ts  

Main features:
- Mint own token
- Send ETH or any other ERC20 tokens to the contract, and whitelist members can take tokens from contract

Functions:

Only Owners:
- mint(address to, uint256 amount)
- multiMint(address[] memory to, uint256 amount)
- addWhitelist(address[] memory _recipient)
- removeWhitelist(address[] memory _recipient)
- withdrawAll(address _recipient)
- withdraw(address _recipient, uint value)

Only whitelist members:
- getEther(uint256 value) - get ETH from contract
- getMyToken(uint256 value) - get MyToken tokens
- getERC20Token(IERC20 token, uint256 value) - get any ERC20 token from contract

Anyone:
- disperseEther(address[] calldata recipients,uint256[] calldata values) - standard disperse function, check https://disperse.app/
- disperseToken(IERC20 token,address[] calldata recipients,uint256[] calldata values) - standard disperse function, check https://disperse.app/
- getBalance() - ETH balance of the contract
- deposit() - deposit ETH to contract
- getTokenBalance(IERC20 token)


Deploy ERC20 Simple contract, consumes less gas

npx hardhat deploy-zksync --script deploy/deploy-erc20.ts  

OnlyOwner:
- mint(address to, uint256 amount)


Deploy Simple contract, consumes less gas

npx hardhat deploy-zksync --script deploy/deploy-simple.ts  

Anyone:
- setSimpleGreat(string memory _greeting)



Deploy Disperse contract

npx hardhat deploy-zksync --script deploy/deploy-simple.ts  

see https://disperse.app/


Explorer https://goerli.explorer.zksync.io/



See an example NFT here: [https://ato.network/ZkSync/0xccA0521D453cA8C84Cb0b56936A4B764992b2F12/1](https://ato.network/ZkSync/0xccA0521D453cA8C84Cb0b56936A4B764992b2F12/1)

You can view your own NFT using [Āto Scanner](https://ato.network/).


## Credits

I mainly used zkSync docs: [https://v2-docs.zksync.io/api/hardhat/getting-started.html](https://v2-docs.zksync.io/api/hardhat/getting-started.html)


