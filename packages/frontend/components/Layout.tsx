import { Box, Header, Main } from 'grommet';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
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
