import { createModule } from '../../../bootstrap/define';
import { Logger } from '../../../bootstrap/logging/logger';
import { useDatabases } from './DB/db';
import { useDeparturesEgress } from './Egress/get_departures';
import { usePackEgress } from './Egress/pack';
import { setup_handle_routes_ingest } from './Handlers/routes';
import { setup_handle_stops_ingest } from './Handlers/stops';
import { setup_handle_trips_ingest } from './Handlers/trips';
export default createModule(__filename, async ({ mb, config }) => {
  const l = new Logger({ scope: 'RoutesApp' });

  const db = await useDatabases(config);

  await usePackEgress(mb, db);
  await useDeparturesEgress(mb, db);

  setup_handle_stops_ingest(mb, db);
  setup_handle_trips_ingest(mb, db);
  setup_handle_routes_ingest(mb, db);

  await mb.wait('Common:FinishedStartup');
  l.info('RoutesApp: Starting', config.services.RoutesApp);
});
