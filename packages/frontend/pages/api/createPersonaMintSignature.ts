import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import EthCrypto from 'eth-crypto';
import crypto from 'crypto';

type Data = {
  signature?: string;
  hash?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { wallet } = req.body;

  const inquiry = await prisma.personaInquiry.findMany({
    where: {
      wallet: String(wallet),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
  });

  try {
    const inquiryRequest = await fetch(
      `https://withpersona.com/api/v1/inquiries/${inquiry[0]?.inquiryId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PERSONA_API_KEY}`,
        },
      }
    );
    const { data } = await inquiryRequest.json();
    const status = data.attributes.status;

    if (status == 'completed') {
      const { fields } = data.attributes;

      const secret = `${fields['birthdate'].value}${fields['name-first'].value}${fields['name-last'].value}`;

      const hash = crypto.createHash('sha512').update(secret).digest('hex');

      const message = EthCrypto.hash.keccak256([
        { type: 'address', value: wallet },
        { type: 'string', value: hash },
      ]);

      const signature = EthCrypto.sign(
        process.env.SIGNATURE_PRIVATE_KEY as string,
        message
      );
      res.status(200).json({ signature, hash });
    } else {
      console.info('Invalid Verification');
      res.status(200).json({ error: 'Invalid Verification' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
