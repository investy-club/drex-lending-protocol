import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, config } from 'hardhat';
import EthCrypto from 'eth-crypto';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('CreDrexKYCBadge', function () {
  let owner: SignerWithAddress,
    signer: SignerWithAddress,
    minter: SignerWithAddress,
    minter2: SignerWithAddress,
    minter3: SignerWithAddress;
  let creDrexKYCBadge: Contract;
  const mintHash1 = 'f26d60305dae929ef8640a75e70dd78ab809cfe9';

  const getSignature = (wallet: SignerWithAddress, mintHash: string) => {
    const message = EthCrypto.hash.keccak256([
      { type: 'address', value: wallet.address },
      { type: 'string', value: mintHash },
    ]);

    const accounts = config.networks.hardhat.accounts;
    const index = 1; // first wallet, increment for next wallets
    const wallet1 = ethers.Wallet.fromMnemonic(
      accounts.mnemonic,
      accounts.path + `/${index}`
    );

    const privateKey1 = wallet1.privateKey;
    const signature = EthCrypto.sign(privateKey1, message);

    return signature;
  };

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    signer = signers[1];
    minter = signers[2];
    minter2 = signers[3];
    minter3 = signers[4];

    const CreDrexKYCBadge = await ethers.getContractFactory('CreDrexKYCBadge');
    creDrexKYCBadge = await CreDrexKYCBadge.deploy(
      signer.address,
      'ipfs://<enter your cid here>',
      2
    );
    await creDrexKYCBadge.deployed();
  });

  it('Should mint a CreDrex KYC Badge', async function () {
    await creDrexKYCBadge
      .connect(minter)
      .mint(1, mintHash1, getSignature(minter, mintHash1));

    expect(await creDrexKYCBadge.balanceOf(minter.address)).to.equal(1);
    expect(await creDrexKYCBadge.tokenURI(0)).to.equal(
      'ipfs://<enter your cid here>'
    );
  });

  it('Should mint and burn a CreDrex KYC Badge', async function () {
    await creDrexKYCBadge
      .connect(minter)
      .mint(1, mintHash1, getSignature(minter, mintHash1));

    expect(await creDrexKYCBadge.tokenURI(0)).to.equal(
      'ipfs://<enter your cid here>'
    );

    await creDrexKYCBadge.connect(minter).burn(0);

    expect(await creDrexKYCBadge.balanceOf(minter.address)).to.equal(0);
  });

  it('Should mint a CreDrex Badge if hash already used only once', async function () {
    await creDrexKYCBadge
      .connect(minter)
      .mint(1, mintHash1, getSignature(minter, mintHash1));

    expect(await creDrexKYCBadge.tokenURI(0)).to.equal(
      'ipfs://<enter your cid here>'
    );

    creDrexKYCBadge
      .connect(minter2)
      .mint(1, mintHash1, getSignature(minter2, mintHash1));

    expect(await creDrexKYCBadge.tokenURI(1)).to.equal(
      'ipfs://<enter your cid here>'
    );
  });

  it('Should NOT mint more than one CreDrex KYC Badge for same wallet address', async function () {
    await creDrexKYCBadge
      .connect(minter)
      .mint(1, mintHash1, getSignature(minter, mintHash1));

    expect(await creDrexKYCBadge.tokenURI(0)).to.equal(
      'ipfs://<enter your cid here>'
    );

    await expect(
      creDrexKYCBadge
        .connect(minter)
        .mint(1, mintHash1, getSignature(minter, mintHash1))
    ).to.be.revertedWith('Already minted');
  });

  it('Should NOT mint a CreDrex KYC Badge if hash already used', async function () {
    await creDrexKYCBadge
      .connect(minter)
      .mint(1, mintHash1, getSignature(minter, mintHash1));

    expect(await creDrexKYCBadge.tokenURI(0)).to.equal(
      'ipfs://<enter your cid here>'
    );

    creDrexKYCBadge
      .connect(minter2)
      .mint(1, mintHash1, getSignature(minter2, mintHash1));

    expect(await creDrexKYCBadge.tokenURI(1)).to.equal(
      'ipfs://<enter your cid here>'
    );

    await expect(
      creDrexKYCBadge
        .connect(minter3)
        .mint(1, mintHash1, getSignature(minter3, mintHash1))
    ).to.be.revertedWith('Mint hash already existent');
  });
});
