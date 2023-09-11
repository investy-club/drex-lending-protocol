import React, { useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { Anchor, Box, Button, Image, Layer } from 'grommet';
import contracts from '../contracts/hardhat_contracts.json';
import { NETWORK_ID } from '@/config';
import { View } from 'grommet-icons';

const Badge = () => {
  const { address } = useAccount();
  const [show, setShow] = useState(false);

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
    <>
      {dataKYC && show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <Box width="medium">
            <Image src="https://lh3.googleusercontent.com/drive-viewer/AITFw-zs49zXxYyFufykDSkwlTtNeLtd7VuL6SpXjftUmqIPlmbHDPDGCDSdIwHKqDAliuHG8mqtZjJSglK4_hus_S3CtKgZsQ=s1600" />
          </Box>
        </Layer>
      )}

      <Anchor
        color="white"
        label={`KYC status: ${dataKYC ? 'verified' : 'missing'}`}
        icon={<View />}
        reverse
        onClick={() => setShow(true)}
      />
    </>
  );
};

export default Badge;
