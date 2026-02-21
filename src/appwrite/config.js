import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

// TODO: Replace with your actual Appwrite project credentials
export const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1'; // Replace with your endpoint
export const APPWRITE_PROJECT_ID = '69989601001dca09436c'; // Replace with your Project ID

client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const tables = new Databases(client); // Utilizing Databases service but naming 'tables' to match console
export const storage = new Storage(client);

// Database and Table IDs - must match Appwrite Console exactly (case-sensitive)
export const DATABASE_ID = '6998970400196bb7d0af';
export const TABLE_SHOWER_TYPES = 'showerTypes';
export const TABLE_PRICING_LOCATIONS = 'pricingLocations';
export const TABLE_PRICING_FLOORS = 'pricingFloors';
export const TABLE_USERS = 'users';
export const BUCKET_ID = '69989e5b003b3bc19821';

export default client;
