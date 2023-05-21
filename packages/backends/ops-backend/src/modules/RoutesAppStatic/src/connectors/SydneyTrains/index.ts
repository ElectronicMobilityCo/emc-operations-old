export const estonia_tallinn_tlt = {
  AgencyName: 'SydneyTrains',
  Region: 'Sydney',
  Country: 'Australia',
  RefreshInterval: 10,
  FetchVolatile: () => {
    console.log('VOLATILE FETCH');
  },
  FetchStatic: () => {
    console.log('STATIC FETCH');
  },
};
