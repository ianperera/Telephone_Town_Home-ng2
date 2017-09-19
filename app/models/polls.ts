

export interface Poll {
  id: number;
  campaignId: number;
  name: string;
  questionScript: string;
  answers: PollAnswer[];
  updateCount: number;
  deletable: boolean;
}

export interface ReqPollParams {
  campaignId: number;
  name: string;
  questionScript: string;
  answers: PollAnswer[];
}

export function genPoll(poll: ReqPollParams & Partial<Poll>): Poll {
  return Object.assign({ id: -1, updateCount: 0, deletable: false }, poll);
}

export interface PollAnswer {
  digit: string;
  answer: string;
}

export interface PollStatsResponse {
  openPollId: number;
  stats: PollStats[];
}

export interface PollStats {
  id: number;
  questionName: string;
  questionScript: string;
  answers: PollAnswerStats[];
}

export interface PollAnswerStats {
  digit: string;
  answer: string;
  count: number;
  total: number;
}

export interface PollOpenParams {
  pollId: number;
  delay: number;
}

export const defaultPollStats: PollStats = {
  id: -1,
  questionName: 'Question',
  questionScript: 'Question Script',
  answers: [],
}