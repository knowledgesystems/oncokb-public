import { Storage } from 'react-jhipster';
import { AppConfig } from 'app/appConfig';

export const AUTH_UER_TOKEN_KEY = 'oncokb-user-token';
export const AUTH_WEBSITE_TOKEN_KEY = 'oncokb-website-token';

export const getPublicWebsiteToken = () => {
  return Storage.session.get(AUTH_WEBSITE_TOKEN_KEY);
};

export const setPublicWebsiteToken = (pubWebToken: string) => {
  Storage.session.set(AUTH_WEBSITE_TOKEN_KEY, pubWebToken);
};

export const getStoredToken = () => {
  return Storage.local.get(AUTH_UER_TOKEN_KEY) || getPublicWebsiteToken();
};

export const assignPublicToken = () => {
  // Inject the public website token to storage
  if (AppConfig.serverConfig.token) {
    setPublicWebsiteToken(AppConfig.serverConfig.token);
  }
};

export function initializeAPIClients() {
  // we need to set the domain of our api clients
  // add POST caching
}
