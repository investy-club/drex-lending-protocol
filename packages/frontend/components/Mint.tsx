import React, { useEffect, useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import contracts from '../contracts/hardhat_contracts.json';
import { NETWORK_ID } from '../config';
import { Button, Spinner, Text } from 'grommet';

const Mint = () => {
  const { address } = useAccount();
  const [signature, setSignature] = useState('');
  const [hash, setHash] = useState('');

  const { data, isLoading, isSuccess, write, isError, error } =
    useContractWrite({
      // @ts-ignore
      address: contracts[NETWORK_ID][0].contracts.CreDrexKYCBadge.address,
      // @ts-ignore
      abi: contracts[NETWORK_ID][0].contracts.CreDrexKYCBadge.abi,
      functionName: 'mint',
    });

  const { isSuccess: isSuccessMint, isLoading: isLoadingMintTx } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  const getSignature = async () => {
    const requestSignature = await fetch('/api/createPersonaMintSignature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet: address,
      }),
    });
    const { signature, hash } = await requestSignature.json();
    setSignature(signature);
    setHash(hash);
  };

  useEffect(() => {
    if (address) {
      getSignature();
    }
  }, [address]);

  if (isError) {
    console.log(error);
    return <Text>Error: only one wallet can be linked with one ID</Text>;
  }

  return (
    <>
      {isSuccessMint ? (
        <Text>Minted</Text>
      ) : isLoading || isLoadingMintTx ? (
        <Spinner />
      ) : (
        <Button
          primary
          onClick={() =>
            write({
              args: [1, hash, signature],
              // @ts-ignore
              from: address,
            })
          }
          label="Mint KYC Badge"
          disabled={!signature}
        ></Button>
      )}
    </>
  );
};

export default Mint;
