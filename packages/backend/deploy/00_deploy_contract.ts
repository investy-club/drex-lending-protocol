import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const main: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [
    '0xE6520dC955DD9388C221ca3fA8704dCF6a78AAf6',
    'https://lh3.googleusercontent.com/drive-viewer/AITFw-zs49zXxYyFufykDSkwlTtNeLtd7VuL6SpXjftUmqIPlmbHDPDGCDSdIwHKqDAliuHG8mqtZjJSglK4_hus_S3CtKgZsQ=s1600',
    2,
  ];
  const creDrexKYCBadge = await deploy('CreDrexKYCBadge', {
    args: args,
    from: deployer,
    log: true,
  });

  const wBRL = await deploy('WrappedBRL', {
    from: deployer,
    log: true,
  });

  const creDrex = await deploy('CreDrex', {
    args: [wBRL.address, creDrexKYCBadge.address],
    from: deployer,
    log: true,
  });
};

export default main;

export const tags = ['all', 'CreDrexKYCBadge', 'CreDrex', 'WrappedBRL'];
