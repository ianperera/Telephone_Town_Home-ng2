import { Action } from '@ngrx/store';

import { CampaignStatsEvent } from '../../models/events';

export const CAMPAIGN_STATS_UPDATE = '[Campaign] New campaign stats event';

export class CampaignStatsUpdate implements Action {
  readonly type = CAMPAIGN_STATS_UPDATE;
  constructor(public payload: CampaignStatsEvent) {}
}

// Discriminated Union of Conference Actions
export type Actions = CampaignStatsUpdate;
