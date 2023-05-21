import { Logger } from '../../../../bootstrap/logging/logger';
import {
  VehicleDeltaApplication,
  VehicleRealtimeDataUpdateDelta,
} from '../models/vehicle_class';
import { Vehicle, VehicleType } from '../vehicle_class';

/*
    tallinn please produce a GTFS feed PLEASE this is actually FUCKING stupid
    what the actual fuck who the hell tried to shoehorn a fucking LIVE FEED 
    into a GTFS seed just use GTFS-R LIKE A NORMAL AGENCY AAAAAAAAAAAAA

    https://transport.tallinn.ee/gps.txt
    Vehicle type, line number, latitude and longitude, speed, label, vehicle number
    lat & long are miltiplied by 1000000
*/

const data_source_url = 'https://transport.tallinn.ee/gps.txt';

const RealtimeVehiclesList: Map<string, string> = new Map();

interface VehicleRawDataObject {
  VehicleType: string;
  LineNumber: string;
  Longitudex1000000: string;
  Latitudex1000000: string;
  Speed: string;
  Label: string;
  VehicleNumber: string;
}

const assembleVComp = (vehicle_el: VehicleRawDataObject) => {
  return `${vehicle_el.VehicleType},${vehicle_el.LineNumber},${vehicle_el.Longitudex1000000},${vehicle_el.Latitudex1000000},${vehicle_el.Speed},${vehicle_el.Label},${vehicle_el.VehicleNumber}}`;
};

const fetch_volatile_data = async () => {
  const l = new Logger({
    scope: 'RoutesApp',
    seg: 'Server',
    sseg: 'EstoniaTallinnIngest-Realtime',
  });
  const vehiclesupdatelist: VehicleRealtimeDataUpdateDelta[] = [];
  const vehiclecurrentlist = new Set();

  const neatCsv = await import('neat-csv');

  const response = await fetch(data_source_url);
  const transitdata = await response.text();
  //console.log(transitdata);

  if (transitdata.startsWith('<!DOCTYPE html>')) return [];
  // bail cause error

  const data: VehicleRawDataObject[] = <VehicleRawDataObject[]>(
    await neatCsv.default(transitdata.trim(), {
      headers: [
        'VehicleType',
        'LineNumber',
        'Longitudex1000000',
        'Latitudex1000000',
        'Speed',
        'Label',
        'VehicleNumber',
      ],
    })
  );

  l.info('numbers', 'Found realtime vehicles.', { vehicles: data.length });

  vehicleIteratorLoop: for (const vehicle_el of data) {
    const VID = `ESTONIA_TALLINN:${vehicle_el.VehicleType}:${vehicle_el.VehicleNumber}`;
    vehiclecurrentlist.add(VID);
    const vehicle = new Vehicle(VID);
    let VChangeType: VehicleDeltaApplication | null = null;

    if (RealtimeVehiclesList.has(VID)) {
      // it exists! check if it's the same
      if (RealtimeVehiclesList.get(VID) !== assembleVComp(vehicle_el)) {
        //it's not the same, so we need to update it
        //l("vehicle", "Found MODIFIED realtime vehicle.", {
        //    id: vehicle.id,
        //});
        RealtimeVehiclesList.set(VID, assembleVComp(vehicle_el));
        VChangeType = VehicleDeltaApplication.VEHICLE_MODIFY;
      } else {
        //it's the same let's break out of it!
        continue vehicleIteratorLoop;
      }
    } else {
      // it's new

      //l.info('Found NEW realtime vehicle.', { id: vehicle.id });
      RealtimeVehiclesList.set(VID, assembleVComp(vehicle_el));
      VChangeType = VehicleDeltaApplication.VEHICLE_ADD;
    }

    vehicle.set_position(
      Number(vehicle_el.Latitudex1000000) / 1000000,
      Number(vehicle_el.Longitudex1000000) / 1000000
    );

    switch (vehicle_el.VehicleType) {
      case '1':
        vehicle.set_type(VehicleType.RAIL_TROLLEY);
        break;
      case '3':
        vehicle.set_type(VehicleType.RAIL_TRAM);
        break;
      case '4':
        vehicle.set_type(VehicleType.BUS_MINI);
        break;
      case '5':
        vehicle.set_type(VehicleType.BUS_COMMUTER);
        vehicle.set_attributes('seasonal', true);
        break;
      case '6':
      default:
        vehicle.set_type(VehicleType.BUS_COMMUTER);
    }

    vehiclesupdatelist.push({
      application: VChangeType,
      vehicle,
    });
  }

  for (const VID of RealtimeVehiclesList.keys()) {
    if (!vehiclecurrentlist.has(VID)) {
      l.info('Found REMOVED realtime vehicle.', { id: VID });
      vehiclesupdatelist.push({
        application: VehicleDeltaApplication.VEHICLE_REMOVE,
        vehicle: new Vehicle(VID),
      });
      RealtimeVehiclesList.delete(VID);
    }
  }

  return vehiclesupdatelist;
};

export const estonia_tallinn_tlt = {
  AgencyName: 'TLT',
  Region: 'Tallinn',
  Country: 'Estonia',
  RefreshVolatileInterval: 1000 * 30,
  RefreshStaticInterval: 1000 * 60 * 60 * 24,
  FetchVolatile: fetch_volatile_data,
  FetchStatic: async () => {
    null;
  },
};
