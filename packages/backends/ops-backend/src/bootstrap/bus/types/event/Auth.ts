export interface AuthEvents {
  'Auth:VerifyRequestedRefreshAccess': {
    username: string;
    password: string;
  };
  'Auth:VerifyRequestedRefreshAccessResponse': {
    refresh_token: string;
    error: 'none' | 'invalid' | 'disabled' | string;
  };
  'Auth:VerifyRequestedTicketAccess': {
    refresh_token: string;
  };
  'Auth:VerifyRequestedTicketAccessResponse': {
    ticket: string;
    error: 'none' | 'invalid' | string;
  };
  'Auth:VerifyRequestedResourceAccess': {
    ticket: string;
  };
}
