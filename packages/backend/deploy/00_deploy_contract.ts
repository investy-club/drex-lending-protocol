import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const main: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = ['0xbC98360986ee6b7D7691c8C474666E7bF0C984de', 'ipfs://', 2];
  await deploy('InvestyClubKYCBadge', {
    args: args,
    from: deployer,
    log: true,
  });
};

export default main;

export const tags = ['all', 'fLockKYCBadge'];
