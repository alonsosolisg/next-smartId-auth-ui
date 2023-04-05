import type { NextApiRequest, NextApiResponse } from 'next';

const authenticateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { nationalIdentityNumber, countryCode } = req.body;

    const response = await fetch('https://smartid-auth-server.onrender.com/api/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nationalIdentityNumber, countryCode })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default authenticateHandler;
