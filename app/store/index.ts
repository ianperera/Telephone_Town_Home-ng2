import { orderBy, values, filter } from 'lodash';
import { createSelector } from 'reselect';
import { ActionReducer } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';

import * as fromUi from './ui/ui.reducers';
import * as fromEvents from './events/events.reducers';
import * as fromParticipants from './participants/participants.reducers';
import * as fromChat from './chat/chat.reducers';
import * as fromConference from './conference/conference.reducers';
import * as fromCampaign from './campaign/campaign.reducers';
import * as fromListeners from './listeners/listeners.reducers';
import * as fromPolls from './polls/polls.reducers';
import * as fromQuestionUpdate from './question-update/question-update.reducers';

export interface State {
    ui: fromUi.State;
    events: fromEvents.State;
    participants: fromParticipants.State;
    chat: fromChat.State;
    conference: fromConference.State;
    campaign: fromCampaign.State;
    listeners: fromListeners.State;
    polls: fromPolls.State;
    questionUpdate: fromQuestionUpdate.State;
}

const reducers = {
    ui: fromUi.reducer,
    events: fromEvents.reducer,
    participants: fromParticipants.reducer,
    chat: fromChat.reducer,
    conference: fromConference.reducer,
    campaign: fromCampaign.reducer,
    listeners: fromListeners.reducer,
    polls: fromPolls.reducer,
    questionUpdate: fromQuestionUpdate.reducer,
};

export const reducer: ActionReducer<State> = combineReducers(reducers);

export const getUIState = (state: State) => state.ui;
export const getParticipantState = (state: State) => state.participants;
export const getChatState = (state: State) => state.chat;
export const getConfState = (state: State) => state.conference;
export const getCampaignState = (state: State) => state.campaign;
export const getListenersState = (state: State) => state.listeners;
export const getPollsState = (state: State) => state.polls;
export const getQuestionUpdateState = (state: State) => state.questionUpdate;


// Participants Selectors
export const getParticipantArray = createSelector(
    getParticipantState,
    fromParticipants.sortFactory()
);
export const getSelectedParticipant = createSelector(
    getUIState,
    getParticipantState,
    (ui, participants) => participants[ui.selectedParticipant]
);

// Chat Selectors
export const getChatAlerts = createSelector(
    getChatState,
    (state: fromChat.State) => state.alerts
);
// This is an inappropriate use of createSelector..
// Chat count should be pulled into the store.
export const getLatestChat = (count: number = 20) =>
    createSelector(getChatState, fromChat.getLatestChat(count));

// Conference Selectors
export const getConfSetup = createSelector(getConfState, fromConference.getSetup);
export const getConfStatus = createSelector(getConfState, fromConference.getStatus);
export const getConfPending = createSelector(getConfState, fromConference.getPending);
export const getConfInitialized = createSelector(getConfState, fromConference.getInitialized);

// Campaign Selectors
export const getMinutesLeft = createSelector(getCampaignState, fromCampaign.getMinutesLeft);
export const getCampaignStats = createSelector(getCampaignState, fromCampaign.getStats);
export const getLatestCampaignStats = createSelector(getCampaignState, fromCampaign.getLatestStats);

// Listener Selectors
export const getListenerStats = createSelector(getListenersState, fromListeners.getStats);
export const getPollsStats = createSelector(getPollsState, fromPolls.getStats);

// Polls Selectors
export const getLatestPollStats = createSelector(getPollsState, fromPolls.getLatestPollStats);
export const getPollStatsById = (id: number) => createSelector(getPollsState, fromPolls.getPollStatsById(id));

// QuestionUpdate (Live) Selectors
export const getQuestionUpdateArray = createSelector(
    getQuestionUpdateState,
    fromQuestionUpdate.filterFactory((val) => {
        return val.status === 16;
    })
);
export const getSelectedQuestion = createSelector(
    getUIState,
    getQuestionUpdateState,
    (ui, questions) => questions[ui.selectedQuestion]
);

// RaisedHand Question Selectors
export const getRaisedHandQuestionUpdate = createSelector(
    getQuestionUpdateState,
    fromQuestionUpdate.filterFactory((val) => {
        return val.status === 1 || val.status === 2;
    })
);
export const getRaisedHandSelectedQuestion = createSelector(
    getUIState,
    getQuestionUpdateState,
    (ui, questions) => questions[ui.selectedRaisedHandQuestion]
);

// On Deck Question Selectors
export const getOnDeckQuestionUpdate = createSelector(
    getUIState,
    getQuestionUpdateState,
    (ui, questions) => orderBy(
        filter(values(questions), (val) => {
            return val.status === 8;
        }),
        'rating', ui.onDeckQuestionOrder
    )
);
export const getOnDeckSelectedQuestion = createSelector(
    getUIState,
    getQuestionUpdateState,
    (ui, questions) => questions[ui.selectedOnDeckQuestion]
);
export const getOnDeckQuestionOrder = createSelector(
    getUIState,
    (ui) => ui.onDeckQuestionOrder
);

// Screened Question Selectors
export const getScreenedQuestionUpdate = createSelector(
    getUIState,
    getQuestionUpdateState,
    (ui, questions) => orderBy(
        filter(values(questions), (val) => {
            return val.status === 4;
        }),
        'rating', ui.screenedQuestionOrder
    )
);
export const getScreenedSelectedQuestion = createSelector(
    getUIState,
    getQuestionUpdateState,
    (ui, questions) => questions[ui.selectedScreenedQuestion]
);
export const getScreenedQuestionOrder = createSelector(
    getUIState,
    (ui) => ui.screenedQuestionOrder
);
