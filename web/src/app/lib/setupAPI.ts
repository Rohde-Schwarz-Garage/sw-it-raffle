import RaffleAPI from '@/api/api';

// Get the API address from the environment variable or use the default value
const domain = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001';

new RaffleAPI(domain);