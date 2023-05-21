export class Vehicle {
    id = "";

    position = {
        lat: 0,
        lon: 0,
        bearing: 0,
    };

    vehicle = {
        class: "",
        type: VehicleType.UNKNOWN,
        label: "",
        attributes: {
            seasonal: false,
            FUCKING_CHRISTMAS_BUS_WHY_DO_I_CARE_ABOUT_THIS: false,
        },
    };

    route = {
        routeID: "",
    };

    constructor(id: string) {
        this.id = id;
    }

    set_position(lat: number, lon: number, bearing?: number) {
        this.position.lat = lat || 0;
        this.position.lon = lon || 0;
        this.position.bearing = bearing || 0;
    }

    set_type(type: VehicleType) {
        this.vehicle.type = type;
    }

    set_attributes(
        attribute_name: keyof typeof this.vehicle.attributes,
        value: boolean
    ) {
        this.vehicle.attributes[attribute_name] = value;
    }
}

export enum VehicleType {
    UNKNOWN,
    RAIL_COMMUTER,
    RAIL_LIGHT,
    RAIL_TRAM,
    RAIL_TROLLEY,
    RAIL_METRO,
    RAIL_HEAVY,
    RAIL_FREIGHT,
    BUS_COMMUTER,
    BUS_LONGDISTANCE,
    BUS_RAPID,
    BUS_TROLLEY,
    BUS_MINI,
}
