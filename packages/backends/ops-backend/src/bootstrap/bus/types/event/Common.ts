export interface CommonEvents {
  'Common:FinishedStartup': {
    hello: string;
  };
  'Common:Clock': {
    WALL: number;
    EPOCH: number;
  };
}
