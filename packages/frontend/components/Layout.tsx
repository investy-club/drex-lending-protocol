import { Box, Button, Header, Heading, Main } from 'grommet';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractRead } from 'wagmi';
import contracts from '../contracts/hardhat_contracts.json';
import { NETWORK_ID } from '@/config';
import { formatEther, formatUnits } from 'viem';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { address } = useAccount();

  const { data } = useContractRead({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.WrappedBRL.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.WrappedBRL.abi,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { data: dataKYC } = useContractRead({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrexKYCBadge.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrexKYCBadge.abi,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  return (
    <Box>
      <Header
        direction="row"
        align="center"
        justify="end"
        pad={{ vertical: 'small', horizontal: 'xlarge' }}
        border="bottom"
        gap="xlarge"
        background="#FFFFFF"
        height="xsmall"
      >
        <Box direction="row" gap="small">
          <Button primary label="Home" href="/" />

          <Button primary label="Faucet" href="/faucet" />
        </Box>
        <Heading level="4">
          {' '}
          Balance: {data
            ? formatUnits(data as unknown as bigint, 18)
            : '0'}{' '}
          wBRL
        </Heading>

        <Heading level="4">
          KYC status: {dataKYC ? 'verified' : 'missing'}{' '}
        </Heading>
        <ConnectButton />
      </Header>
      <Main>
        <Box align="center" justify="center" height="100vh">
          {children}
        </Box>
      </Main>
    </Box>
  );
};
