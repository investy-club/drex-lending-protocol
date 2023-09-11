import { Layout } from '@/components/Layout';
import { Box, Text } from 'grommet';
import { useAccount, useContractRead } from 'wagmi';
import { NETWORK_ID } from '../config';
import { useEffect, useState } from 'react';
import contracts from '../contracts/hardhat_contracts.json';
import KYC from '@/components/KYC';

export default function Home() {
  const { address } = useAccount();
  const [isMinted, setIsMinted] = useState(false);

  const { data, isSuccess } = useContractRead({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.InvestyClubKYCBadge.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.InvestyClubKYCBadge.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  useEffect(() => {
    if (Number(data) > 0) {
      setIsMinted?.(true);
    }
  }, [isSuccess]);

  return (
    <Layout>
      <Box>
        {!address ? (
          <Text>Not connected</Text>
        ) : isMinted ? (
          <Text>You are minted</Text>
        ) : (
          <KYC />
        )}
      </Box>
    </Layout>
  );
}
