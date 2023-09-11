import React, { useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import contracts from '../contracts/hardhat_contracts.json';
import { NETWORK_ID } from '../config';
import { Box, Button, Spinner, Text, TextInput } from 'grommet';
import { Layout } from '@/components/Layout';
import { parseUnits } from 'viem';

const Faucet = () => {
  const { address } = useAccount();
  const [amount, setAmount] = useState(0);

  const { data, isLoading, isSuccess, write, isError, error } =
    useContractWrite({
      // @ts-ignore
      address: contracts[NETWORK_ID][0].contracts.WrappedBRL.address,
      // @ts-ignore
      abi: contracts[NETWORK_ID][0].contracts.WrappedBRL.abi,
      functionName: 'mint',
    });

  const { isSuccess: isSuccessMint, isLoading: isLoadingMintTx } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  return (
    <Layout>
      {isSuccessMint ? (
        <Text>Minted</Text>
      ) : isLoading || isLoadingMintTx ? (
        <Spinner />
      ) : (
        <Box gap="medium">
          <TextInput
            placeholder="Enter amount to mint"
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
          />
          <Button
            primary
            onClick={() =>
              write({
                args: [address, parseUnits(amount.toString(), 18)],
                // @ts-ignore
                from: address,
              })
            }
            label="Mint wBRL"
            disabled={amount === 0}
          ></Button>
        </Box>
      )}
    </Layout>
  );
};

export default Faucet;
