import { Layout } from '@/components/Layout';
import { Box, Button, Heading, Text, TextInput } from 'grommet';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { NETWORK_ID } from '../config';
import { useEffect, useState } from 'react';
import contracts from '../contracts/hardhat_contracts.json';
import KYC from '@/components/KYC';
import { parseUnits } from 'viem';

export default function Home() {
  const { address } = useAccount();
  const [isMinted, setIsMinted] = useState(false);
  const [amount, setAmount] = useState(0);

  const { data, isSuccess } = useContractRead({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrexKYCBadge.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrexKYCBadge.abi,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { data: dataApprove, write: writeApprove } = useContractWrite({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.WrappedBRL.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.WrappedBRL.abi,
    functionName: 'approve',
  });

  const { isSuccess: isSuccessApprove, isLoading: isLoadingApproveTx } =
    useWaitForTransaction({
      hash: dataApprove?.hash,
    });

  const { data: dataDeposit, write: writeDeposit } = useContractWrite({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrex.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrex.abi,
    functionName: 'deposit',
  });

  const { isSuccess: isSuccessDeposit, isLoading: isLoadingDepositTx } =
    useWaitForTransaction({
      hash: dataDeposit?.hash,
    });

  const { data: dataWithdraw, write: writeWithdraw } = useContractWrite({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrex.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrex.abi,
    functionName: 'withdraw',
  });

  const { isSuccess: isSuccessWithdraw, isLoading: isLoadingWithdrawTx } =
    useWaitForTransaction({
      hash: dataWithdraw?.hash,
    });

  const { data: dataBorrow, write: writeBorrow } = useContractWrite({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrex.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrex.abi,
    functionName: 'borrow',
  });

  const { isSuccess: isSuccessBorrow, isLoading: isLoadingBorrowTx } =
    useWaitForTransaction({
      hash: dataBorrow?.hash,
    });

  const { data: dataRepay, write: writeRepay } = useContractWrite({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrex.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrex.abi,
    functionName: 'repay',
  });

  const { isSuccess: isSuccessRepay, isLoading: isLoadingRepayTx } =
    useWaitForTransaction({
      hash: dataRepay?.hash,
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
          <Box gap="large">
            <Box gap="medium">
              <TextInput
                placeholder="Amount"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <Button
                primary
                label="Approve"
                onClick={() =>
                  writeApprove({
                    args: [
                      contracts[NETWORK_ID][0].contracts.CreDrex.address,
                      parseUnits(amount.toString(), 18),
                    ],
                    // @ts-ignore
                    from: address,
                  })
                }
              />
            </Box>
            <Box direction="row" gap="xlarge">
              <Box gap="medium" align="center">
                <Heading>Lending</Heading>
                <Box direction="row" gap="medium">
                  <Button
                    primary
                    label="Deposit"
                    onClick={() =>
                      writeDeposit({
                        args: [parseUnits(amount.toString(), 18)],
                        // @ts-ignore
                        from: address,
                      })
                    }
                  />
                  <Button
                    primary
                    label="Withdraw"
                    onClick={() =>
                      writeWithdraw({
                        args: [parseUnits(amount.toString(), 18)],
                        // @ts-ignore
                        from: address,
                      })
                    }
                  />
                </Box>
              </Box>
              <Box gap="medium" align="center">
                <Heading>Borrowing</Heading>
                <Box direction="row" gap="medium">
                  <Button
                    primary
                    label="Borrow"
                    onClick={() =>
                      writeBorrow({
                        args: [parseUnits(amount.toString(), 18)],
                        // @ts-ignore
                        from: address,
                      })
                    }
                  />
                  <Button
                    primary
                    label="Repay"
                    onClick={() =>
                      writeRepay({
                        args: [parseUnits(amount.toString(), 18)],
                        // @ts-ignore
                        from: address,
                      })
                    }
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <KYC />
        )}
      </Box>
    </Layout>
  );
}
