import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const main: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = ['0xE6520dC955DD9388C221ca3fA8704dCF6a78AAf6', 'ipfs://', 2];
  await deploy('InvestyClubKYCBadge', {
    args: args,
    from: deployer,
    log: true,
  });
};

export default main;

export const tags = ['all', 'fLockKYCBadge'];
