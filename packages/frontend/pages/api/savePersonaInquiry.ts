import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

type Data = {
  inquiry: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { wallet, inquiryId } = req.body;

  try {
    const inquiry = await prisma.personaInquiry.create({
      data: {
        wallet,
        inquiryId,
      },
    });
    res.status(200).json({ inquiry });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
