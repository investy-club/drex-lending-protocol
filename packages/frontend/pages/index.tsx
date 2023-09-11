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
import { formatEther, parseUnits } from 'viem';

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

  const { data: dataDepositRate } = useContractRead({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrex.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrex.abi,
    functionName: '_depositRate',
    watch: true,
  });

  const { data: dataBorrowRate } = useContractRead({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrex.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrex.abi,
    functionName: '_borrowRate',
    watch: true,
  });

  const { data: dataTotalBorrowed } = useContractRead({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrex.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrex.abi,
    functionName: 'totalBorrowed',
    watch: true,
  });

  const { data: dataTotalDeposited } = useContractRead({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrex.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrex.abi,
    functionName: 'totalDeposit',
    watch: true,
  });

  const { data: dataUsersBorrowed } = useContractRead({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrex.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrex.abi,
    functionName: 'usersBorrowed',
    args: [address],
    watch: true,
  });

  const { data: dataUsersDeposited } = useContractRead({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrex.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrex.abi,
    functionName: 'usersDeposited',
    args: [address],
    watch: true,
  });

  const { data: dataTotalReserve } = useContractRead({
    // @ts-ignore
    address: contracts[NETWORK_ID][0].contracts.CreDrex.address,
    // @ts-ignore
    abi: contracts[NETWORK_ID][0].contracts.CreDrex.abi,
    functionName: 'totalReserve',
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
            <Box>
              <Text>
                Protocol Reserve:{' '}
                {dataTotalReserve ? formatEther(dataTotalReserve as any) : '0'}
              </Text>
              <Text>
                Protocol Deposited:{' '}
                {dataTotalDeposited
                  ? formatEther(dataTotalDeposited as any)
                  : '0'}
              </Text>
              <Text>
                Protocol Borrowed:{' '}
                {dataTotalBorrowed
                  ? formatEther(dataTotalBorrowed as any)
                  : '0'}
              </Text>
              <Text>
                Your deposit{' '}
                {dataUsersDeposited
                  ? formatEther(dataUsersDeposited as any)
                  : '0'}
              </Text>
              <Text>
                Your borrow{' '}
                {dataUsersBorrowed
                  ? formatEther(dataUsersBorrowed as any)
                  : '0'}
              </Text>
            </Box>
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
                        // @ts-ignore
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
                  <Text>
                    {dataDepositRate
                      ? formatEther(dataDepositRate as any)
                      : '0'}{' '}
                    APY
                  </Text>
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
                  <Text>{formatEther(dataBorrowRate as any)} Fee</Text>
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
          </Box>
        ) : (
          <KYC />
        )}
      </Box>
    </Layout>
  );
}
