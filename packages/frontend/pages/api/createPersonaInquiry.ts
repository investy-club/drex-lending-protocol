import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  inquiryId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { wallet } = req.body;

  try {
    const inquiryRequest = await fetch(
      'https://withpersona.com/api/v1/inquiries',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Persona-Version': '2023-01-05',
          'content-type': 'application/json',
          Authorization: `Bearer ${process.env.PERSONA_API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              'inquiry-template-id': 'itmpl_cZXmtRd6U1AW6o2VU1vWTHDK',
              'reference-id': wallet,
              fields: {
                'crypto-wallet-address': wallet,
              },
            },
          },
        }),
      }
    );
    const { data, errors } = await inquiryRequest.json();
    if (errors) {
      console.error(errors);
      res.status(500).end();
    }

    res.status(200).json({ inquiryId: data.id });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
