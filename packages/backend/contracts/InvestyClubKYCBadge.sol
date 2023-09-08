// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "erc721a/contracts/ERC721A.sol";
import "erc721a/contracts/extensions/ERC721ABurnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract InvestyClubKYCBadge is ERC721A, ERC721ABurnable, Ownable {
    address private signer;
    string public uri;
    mapping(string => bool[]) private hashes;
    uint256 private badgePerUserAmount;

    error SoulboundTokenCannotBeTransferred();

    constructor(
        address _signer,
        string memory _uri,
        uint256 _badgePerUserAmount
    ) ERC721A("InvestyClubKYC", "INVCKYC") {
        signer = _signer;
        uri = _uri;
        badgePerUserAmount = _badgePerUserAmount;
    }

    function setSigner(address _signer) public onlyOwner {
        signer = _signer;
    }

    function setUri(string memory _uri) public onlyOwner {
        uri = _uri;
    }

    function setBadgePerUserAmount(
        uint256 _badgePerUserAmount
    ) public onlyOwner {
        badgePerUserAmount = _badgePerUserAmount;
    }

    function mint(
        uint256 _quantity,
        string memory _mintHash,
        bytes calldata _signature
    ) public {
        require(balanceOf(msg.sender) == 0, "Already minted");
        require(
            hashes[_mintHash].length < badgePerUserAmount,
            "Mint hash already existent"
        );
        require(
            _verify(_hash(msg.sender, _mintHash), _signature),
            "Invalid signature"
        );

        hashes[_mintHash].push(true);
        _mint(msg.sender, _quantity);
    }

    function _hash(
        address _to,
        string memory _mintHash
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_to, _mintHash));
    }

    function _verify(
        bytes32 digest,
        bytes memory signature
    ) internal view returns (bool) {
        return SignatureChecker.isValidSignatureNow(signer, digest, signature);
    }

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 startTokenId,
        uint256 quantity
    ) internal virtual override {
        if (from != address(0))
            if (to != address(0)) revert SoulboundTokenCannotBeTransferred();
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return uri;
    }
}
