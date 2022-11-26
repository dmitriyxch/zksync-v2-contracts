// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    string _myBaseURI = "https://ipfs.io/ipfs/";

    Counters.Counter private _tokenIdCounter;

    string uri;

    constructor(
        string memory name,
        string memory symbol,
        string memory _uri
    ) ERC721(name, symbol) {
        uri = _uri;
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function freeMint(address to) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function multiSafeMint(address[] calldata to) public onlyOwner {
        for (uint256 i = 0; i < to.length; i++) {
            safeMint(to[i]);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return _myBaseURI;
    }

    function setURI(string memory newuri) public onlyOwner {
        _myBaseURI = newuri;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
