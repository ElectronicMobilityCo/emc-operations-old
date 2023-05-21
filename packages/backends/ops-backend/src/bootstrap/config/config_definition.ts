import { z } from 'zod';

export const Config_Definition = z.object({
  debug: z.boolean().default(false),
  overrides: z
    .object({
      environment: z
        .object({
          max_threads: z.number().max(5).default(0),
        })
        .default({}),
    })
    .default({}),
  storage: z.object({}).default({}),
  auth: z
    .object({
      db: z.string().default('./workdir/auth/db.db'),
      default: z
        .object({
          user: z.string().default('EMCDefaultAuthTicket'),
          pass: z.string().default('testing'),
        })
        .default({}),
    })
    .default({}),
  services: z
    .object({
      RoutesApp: z
        .object({
          db_static: z
            .string()
            .default('./workdir/services/RoutesApp/db/static.db'),
          db_volatile: z
            .string()
            .default('./workdir/services/RoutesApp/db/volatile.db'),
          dir_scratch: z
            .string()
            .default('./workdir/services/RoutesApp/scratch/'),

          apiKey_TransportForNSW: z
            .string()
            .default(process.env['TFNSW_API_KEY'] || '__NOAUTH'),
        })
        .default({}),
    })
    .default({}),

  Service_RoutesApp: z
    .object({
      API_SUBPATH: z.string().default('/api/routesapp/'),
      TEST_CONNECTOR_TFNSW_ENABLE: z.boolean().default(false),
      TEST_CONNECTOR_TFNSW_APIKEY: z
        .string()
        .default(process.env['TFNSW_API_KEY'] || '__NOAUTH'),
      TEST_CONNECTOR_TFNSW_STALETIME: z.number().default(1000 * 5),
      DATABASE: z
        .object({
          static: z
            .string()
            .default('./workdir/Service_RoutesApp/db/static.db'), // def to memory implementation for testing
          volatile: z
            .string()
            .default('./workdir/Service_RoutesApp/db/volatile.db'),
        })
        .default({}),
    })
    .default({}),
});

export type Config_Type = z.infer<typeof Config_Definition>;
