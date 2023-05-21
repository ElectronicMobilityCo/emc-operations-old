type OpsApiRoute<req extends object, res extends object> = {
  req: req;
  res: res;
};

export interface OpsApiRoutes {
  '/auth/request_refresh': OpsApiRoute<
    {
      username: string;
      password: string;
    },
    {
      refresh: string;
    }
  >;
  '/auth/request_ticket': OpsApiRoute<
    {
      refresh: string;
    },
    {
      ticket: string;
      expiry: string;
    }
  >;
}
