import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  constructor() {}

  public polling = {
    heartbeat: 250,
    timeout: 1800000
  };

  public http = {
    timeout: 5000
  };
}