import { algoliasearch } from 'algoliasearch';

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID || '';
const ALGOLIA_API_KEY = import.meta.env.VITE_ALGOLIA_API_KEY || '';

export const algoliaClient = ALGOLIA_APP_ID && ALGOLIA_API_KEY
  ? algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
  : null;

export const PROMPTS_INDEX = 'prompts';
