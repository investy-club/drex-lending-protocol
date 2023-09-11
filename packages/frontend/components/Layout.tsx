import { Box, Button, Header, Heading, Image, Main } from 'grommet';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractRead } from 'wagmi';
import contracts from '../contracts/hardhat_contracts.json';
import { NETWORK_ID } from '@/config';
import { formatUnits } from 'viem';
import Badge from './Badge';

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

  return (
    <Box>
      <Header
        direction="row-responsive"
        align="center"
        justify="between"
        pad={{ vertical: 'small', horizontal: 'xlarge' }}
        border="bottom"
        gap="xlarge"
        background="#0054c8"
      >
        <Box width="xsmall">
          <Image src="images/logo_white.png" />
        </Box>
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
        <Badge />
        <ConnectButton />
      </Header>
      <Main>
        <Box
          align="center"
          justify="start"
          height="100vh"
          pad={{ top: '40px' }}
        >
          {children}
        </Box>
      </Main>
    </Box>
  );
};
