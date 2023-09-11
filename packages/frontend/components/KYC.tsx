import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import dynamic from 'next/dynamic';
import { Box, Button, Text } from 'grommet';
import Mint from './Mint';

export const PersonaInquiry = dynamic(
  () => import('persona').then((module) => module.Inquiry),
  { ssr: false }
);

const KYC = () => {
  const { address } = useAccount();
  const [processing, setProcessing] = useState(true);
  const [inquiryId, setInquiryId] = useState();

  const handleStartKYC = async () => {
    const createInquiryRequest = await fetch('/api/createPersonaInquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallet: address }),
    });
    const { inquiryId } = await createInquiryRequest.json();
    setInquiryId(inquiryId);
  };

  return (
    <>
      {processing ? (
        inquiryId ? (
          <Box height="large">
            <div className="persona">
              <PersonaInquiry
                inquiryId={inquiryId}
                onLoad={() => {
                  console.log('Loaded inline');
                }}
                onComplete={async ({ inquiryId, status, fields }) => {
                  // Inquiry completed. Optionally tell your server about it.
                  console.log(
                    `Sending finished inquiry ${inquiryId} to backend`
                  );
                  await fetch('/api/savePersonaInquiry', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ wallet: address, inquiryId }),
                  });
                  setProcessing(false);
                }}
              />
            </div>
          </Box>
        ) : (
          <Button primary onClick={handleStartKYC} label="Iniciar KYC"></Button>
        )
      ) : (
        <Mint />
      )}
    </>
  );
};

export default KYC;
