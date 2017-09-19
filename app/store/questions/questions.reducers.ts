import { orderBy, values, filter, omit, set, assign } from 'lodash';

import { QuestionData, QuestionStatus } from '../../models/events';
import * as questions from './questions.actions';

export interface Question extends QuestionData {
  pending: boolean;
}

export interface State {
  [index: number]: Question;
};

const initialState: State = {};

export function reducer(state = initialState, action: questions.Actions): State {
  switch (action.type) {
    case questions.ONDECK_QUESTION_START:
    case questions.DONE_QUESTION_START:
    case questions.BAN_QUESTION_START:
    case questions.DNC_QUESTION_START:
    case questions.REJECT_QUESTION_START:
    case questions.LIVE_QUESTION_START:
    case questions.EDIT_QUESTION_START:
      return set(state, action.payload.id, {pending: true});

    case questions.ONDECK_QUESTION_SUCCESS:
    case questions.DONE_QUESTION_SUCCESS:
    case questions.BAN_QUESTION_SUCCESS:
    case questions.DNC_QUESTION_SUCCESS:
    case questions.REJECT_QUESTION_SUCCESS:
    case questions.LIVE_QUESTION_SUCCESS:
    case questions.EDIT_QUESTION_SUCCESS:
    case questions.ONDECK_QUESTION_FAILURE:
    case questions.DONE_QUESTION_FAILURE:
    case questions.DNC_QUESTION_FAILURE:
    case questions.DNC_QUESTION_FAILURE:
    case questions.REJECT_QUESTION_FAILURE:
    case questions.LIVE_QUESTION_FAILURE:
    /**
     * The success actions here should return the new state of the question, when they do
     * we can actually update the full question instead of just the pending property.
     */
      return set(state, action.payload.id, {pending: false});
    case questions.EDIT_QUESTION_FAILURE:
      return set(state, action.payload.question.id, {pending: false});

    case questions.UPDATE:
      if (!!state[action.payload.id]) { // If this is a new question, just add it to state.
        return assign({}, state, {[action.payload.id]: {...action.payload, pending: false}});
      } else { // Otherwise update the existing question in state
        return set(state, action.payload.id, action.payload);
      }
    
    case questions.REMOVE:
      return omit<State, State>(state, action.payload.id);

    default:
      return state;
  }
}

/**
 * Export the sortFactory so createSelector can memoize sorted lists.
 * Defaults to sort on id.
 */
export function sortFactory(iteratee: string | string[] = 'id', order?: string | string[]) {
  return (state: State) => orderBy(values(state), iteratee, order);
}

/**
 * Export the filterFactory so createSelector can memoize filtered lists.
 * This guy can also sort.. defaults to sort on id.
 */
export function filterFactory(
    predicate: (q: Question) => boolean,
    iteratee: string | string[] = 'id',
    order?: string | string[]) {
  return (state: State) => orderBy(filter(values(state), predicate), iteratee, order);
}

export const getBannedQuestions = filterFactory(q => q.status === QuestionStatus.BANNED);
export const getDncQuestions = filterFactory(q => q.status === QuestionStatus.DNC);
export const getDoneQuestions = filterFactory(q => q.status === QuestionStatus.DONE);
export const getHandRaisedQuestions = filterFactory(q => q.status === QuestionStatus.HAND_RAISED);
export const getLiveQuestions = filterFactory(q => q.status === QuestionStatus.LIVE);
export const getOnDeckQuestions = filterFactory(q => q.status === QuestionStatus.ON_DECK);
export const getScreenedQuestions = filterFactory(q => q.status === QuestionStatus.SCREENED);
export const getScreenerLeftQuestions = filterFactory(q => q.status === QuestionStatus.SCREENER_LEFT);
export const getScreeningQuestions = filterFactory(q => q.status === QuestionStatus.SCREENING);
