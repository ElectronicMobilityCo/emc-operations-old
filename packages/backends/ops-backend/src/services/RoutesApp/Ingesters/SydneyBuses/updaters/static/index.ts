import { readFile, writeFile } from 'fs/promises';
import { OpsConfig } from '../../../../../../bootstrap/config/config_loader';
import { Logger } from '../../../../../../bootstrap/logging/logger';
import { parse } from 'csv-parse/sync';
import JSZip from 'jszip';
import { parseStops } from './parsers/stops';
import { parseTrips } from './parsers/trips';
import { parseRoutes } from './parsers/routes';

const RetrieveBundle = async (
  bundleURL: string,
  apiKey: string,
  scratchDir: string
) => {
  const DebugMethod = true;
  if (DebugMethod) {
    const buffer = await readFile(`${scratchDir}/sydneybuses/tfnsw-gtfs.zip`);
    return buffer;
  } else {
    const data = await fetch(bundleURL, {
      method: 'GET',
      headers: {
        Authorization: 'apikey ' + apiKey,
      },
    });
    const buffer = await data.arrayBuffer();
    const asBuffer = Buffer.from(buffer);
    await writeFile(`${scratchDir}/sydneybuses/tfnsw-gtfs.zip`, asBuffer);

    return asBuffer;
  }
};

const ParseBundle = async (bundle: Buffer) => {
  const l = new Logger({
    scope: 'RoutesApp',
    seg: `Ingester:SydneyBusesStaticUpdater`,
    sseg: 'BundleParser',
  });
  const bundleFiles = [
    'agency.txt',
    'calendar.txt',
    //'occupancies.txt',
    'routes.txt',
    //'shapes.txt',
    'stop_times.txt',
    'stops.txt',
    'trips.txt',
    //'vehicle_boardings.txt',
    //'vehicle_categories.txt',
    //'vehicle_couplings.txt',
  ];
  l.debug(`Loading bundle...`);
  const zipbundle = await JSZip.loadAsync(bundle);

  const GTFSFiles = new Map();

  for (const file of bundleFiles) {
    try {
      l.debug(`Trying to parse ${file}...`);
      const ref = zipbundle.file(file);
      if (ref == null) {
        GTFSFiles.set(file, {});
      } else {
        const raw = await ref.async('string');

        const parsed = parse(raw, {
          columns: true,
          skip_empty_lines: true,
        });

        GTFSFiles.set(file, parsed);
      }
    } catch (e) {
      l.warn(`Failed to parse ${file}`, e);
    }
  }

  return GTFSFiles;
};

export const StaticUpdate = async (
  config: OpsConfig,
  bundleURL: string,
  apiKey: string
) => {
  const l = new Logger({
    scope: 'RoutesApp',
    seg: `Ingester:SydneyBusesStaticUpdater`,
  });

  l.info('Running Static Updater');

  // fetch the data
  l.debug('Fetching data...', apiKey);
  const RawZipBundle = await RetrieveBundle(
    bundleURL,
    apiKey,
    config.services.RoutesApp.dir_scratch
  );
  l.debug('Got data...');
  const bundle = await ParseBundle(RawZipBundle);

  //console.log(bundle);

  // start parsing

  const stops = await parseStops(bundle);
  console.log('parsed stops');
  const lines = await parseRoutes(bundle);
  console.log('parsed lines', lines?.lines.length);
  const trips = await parseTrips(bundle);
  console.log('parsed trips', trips?.trips.length);

  return {
    trips,
    lines,
    stops,
  };
};
