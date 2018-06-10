import { getRequestUrl, getResource } from "../common.js"

// ***** App

export const updateRoute = (route) => {
  return {
    type: 'UPDATE_ROUTE',
    route: route,
    errors: []
  }
}

export const updateMessage = (message) => {
  return {
    type: 'UPDATE_MESSAGE',
    message: message
  }
}

export const updatePeriod = (period) => {
  return {
    type: 'UPDATE_PERIOD',
    period: period
  }
}

export const loadEnvironment = () => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/environment', {}),
      method: 'GET',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch('fetchEnvironmentSuccess', response);
        }
        else {
          dispatch('fetchEnvironmentKeyError', response.errors);
        }
      }
    });
  });
}

export const fetchEnvironmentSuccess = (keys) => {
  return {
    type: 'ENVIRONMENT_FETCH_SUCCESS',
    analyticsKey: keys.GOOGLE_ANALYTICS_KEY,
    pushKey: keys.PUSH_KEY,
  }
}

export const fetchEnvironmentError = (message) => {
  return {
    type: 'ENVIRONMENT_FETCH_ERROR',
    message: message
  }
}

// ***** Authentication

/**
 * Extract credentials from a HTTP response
 */
const extractCredentials = (xhr) => {
  return {
    'access-token': xhr.getResponseHeader('access-token'),
    uid: xhr.getResponseHeader('uid'),
    client: xhr.getResponseHeader('client'),
    'token-type': 'Bearer'
  };
}

export const signin = (email, password) => (dispatch) => {
  dispatch((dispatch) => {
    let url = getRequestUrl('/auth/sign_in', {email: email, password: password});
    getResource({
      url: url,
      method: 'POST',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(signInSuccess(extractCredentials(e.target)));
        }
        else {
          dispatch(signInError(response.errors));
        }
      }
    });
  });
}

export const signInSuccess = (credentials) => {
  return {
    type: 'SIGN_IN_SUCCESS',
    credentials: credentials
  }
}

export const signInError = (errors) => {
  return {
    type: 'SIGN_IN_ERROR',
    errors: errors
  }
}

export const signup = (name, email, password, confirmation, successUrl) => (dispatch) => {
  dispatch((dispatch) => {
    let url = getRequestUrl('/auth/', {
      name: name,
      email: email,
      password: password,
      password_confirmation: confirmation,
      confirm_success_url: successUrl
    });

    getResource({
      url: url,
      method: 'POST',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(signUpSuccess());
        }
        else {
          dispatch(signUpError(response.errors));
        }
      }
    });
  });
}

export const signUpSuccess = () => {
  return {
    type: 'SIGN_UP_SUCCESS'
  }
}

export const signUpError = (errors) => {
  return {
    type: 'SIGN_UP_ERROR',
    errors: errors
  }
}

export const forgotPassword = (email, redirectUrl) => (dispatch) => {
  dispatch((dispatch) => {
    let url = getRequestUrl('/auth/password', {
      email: email,
      redirect_url: redirectUrl
    });

    getResource({
      url: url,
      method: 'POST',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(forgotPasswordSuccess(response.message));
        }
        else {
          dispatch(forgotPasswordError(response.errors));
        }
      }
    });
  });
}

export const forgotPasswordSuccess = (message) => {
  return {
    type: 'FORGOT_PASSWORD_SUCCESS',
    message: message
  }
}

export const forgotPasswordError = (errors) => {
  return {
    type: 'FORGOT_PASSWORD_ERROR',
    message: errors[0]
  }
}

export const updatePassword = (password, passwordConfirmation, headers) => (dispatch) => {
  dispatch((dispatch) => {
    let url = getRequestUrl('/auth/password', {
      password: password,
      password_confirmation: passwordConfirmation
    });

    getResource({
      url: url,
      method: 'PUT',
      headers: headers,
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(updatePasswordSuccess(response.message));
        }
        else {
          dispatch(updatePasswordError(response.errors));
        }
      }
    });
  });
}

export const updatePasswordSuccess = (message) => {
  return {
    type: 'UPDATE_PASSWORD_SUCCESS',
    message: message
  }
}

export const updatePasswordError = (errors) => {
  return {
    type: 'UPDATE_PASSWORD_ERROR',
    errors: errors
  }
}

export const signout = () => {
  return {
    type: 'SIGN_OUT'
  }
}

// ***** User management

export const loadUser = () => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/users/-1', {}),
      method: 'GET',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchUserSuccess(response));
        }
        else {
          dispatch(fetchUserError(response.errors));
        }
      }
    });
  });
}

export const fetchUserSuccess = (user) => {
  return {
    type: 'USER_FETCH_SUCCESS',
    user: user
  }
}

export const fetchUserError = (message) => {
  return {
    type: 'USER_FETCH_ERROR',
    message: message
  }
}

export const updateUser = (id, user) => (dispatch) => {
  dispatch((dispatch) => {
    dispatch(updateUserStart());
    getResource({
      url: getRequestUrl('/users/' + id, user),
      method: 'PUT',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(updateUserSuccess(response));
        }
        else {
          dispatch(updateUserError(response.errors));
        }
      }
    });
  });
}

export const updateUserStart = () => {
  return {
    type: 'USER_FETCH_START'
  }
}

export const updateUserSuccess = (user) => {
  return {
    type: 'USER_UPDATE_SUCCESS',
    user: user
  }
}

export const updateUserError = (errors) => {
  return {
    type: 'USER_UPDATE_ERROR',
    errors: errors
  }
}

export const saveSubscription = (subscription) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/users/-1/save-subscription', { subscription: JSON.stringify(subscription) }),
      method: 'POST',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(saveSubscriptionSuccess());
        }
        else {
          dispatch(saveSubscriptionError(response.errors));
        }
      }
    });
  });
}

export const saveSubscriptionSuccess = () => {
  return {
    type: 'SUBSCRIPTION_SUCCESS'
  }
}

export const saveSubscriptionError = (errors) => {
  return {
    type: 'SUBSCRIPTION_ERROR',
    errors: errors
  }
};

// ***** Pages management

export const loadPages = () => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages', {per_page:9999}),
      method: 'GET',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchPagesSuccess(response));
        }
        else {
          dispatch(fetchPagesError(response.errors));
        }
      }
    });
  });
}

export const fetchPagesSuccess = (pages) => {
  return {
    type: 'PAGES_FETCH_SUCCESS',
    pages: pages
  }
}

export const fetchPagesError = (errors) => {
  return {
    type: 'PAGES_FETCH_ERROR',
    errors: errors
  }
}

export const loadPage = (id) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages/' + id, {}),
      method: 'GET',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchPageSuccess(response));
        }
        else {
          dispatch(fetchPageError(response.errors));
        }
      }
    });
  });
}

export const fetchPageSuccess = (page) => {
  return {
    type: 'PAGE_FETCH_SUCCESS',
    page: page
  }
}

export const fetchPageError = (errors) => {
  return {
    type: 'PAGE_FETCH_ERROR',
    errors: errors
  }
}

export const createPage = (name, url) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages', { name: name, url: url }),
      method: 'POST',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(createPageSuccess());
        }
        else {
          dispatch(createPageError(response.errors));
        }
      }
    });
  });
}

export const createPageSuccess = () => {
  return {
    type: 'PAGE_CREATE_SUCCESS'
  }
}

export const createPageError = (errors) => {
  return {
    type: 'PAGE_CREATE_ERROR',
    errors: errors
  }
}

export const updatePage = (id, page) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages/' + id, page),
      method: 'PUT',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(updatePageSuccess(response));
        }
        else {
          dispatch(updatePageError(response.errors));
        }
      }
    });
  });
}

export const updatePageSuccess = (page) => {
  return {
    type: 'PAGE_UPDATE_SUCCESS',
    page: page
  }
}

export const updatePageError = (errors) => {
  return {
    type: 'PAGE_UPDATE_ERROR',
    errors: errors
  }
}

export const deletePage = (id) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages/' + id, {}),
      method: 'DELETE',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(deletePageSuccess(response));
        }
        else {
          dispatch(deletePageError(response.errors));
        }
      }
    });
  });
}

export const deletePageSuccess = (page) => {
  return {
    type: 'PAGE_DELETE_SUCCESS',
    page: page
  }
}

export const deletePageError = (errors) => {
  return {
    type: 'PAGE_DELETE_ERROR',
    errors: errors
  }
}


// ***** Page members management

export const loadPageMembers = (pageId) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages/' + pageId + '/members', {}),
      method: 'GET',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchPageMembersSuccess(response));
        }
        else {
          dispatch(fetchPageMembersError(response.errors));
        }
      }
    });
  });
}

export const fetchPageMembersSuccess = (members) => {
  return {
    type: 'PAGE_MEMBERS_FETCH_SUCCESS',
    members: members
  }
}

export const fetchPageMembersError = (errors) => {
  return {
    type: 'PAGE_MEMBERS_FETCH_ERROR',
    errors: errors
  }
}

export const createPageMember = (pageId, member) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages/' + pageId + '/members', member),
      method: 'POST',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          this.loadPageMembers(pageId);
          dispatch(createPageMemberSuccess(response));
        }
        else {
          dispatch(createPageMemberError(response.message));
        }
      }
    });
  });
}

export const createPageMemberSuccess = (member) => {
  return {
    type: 'PAGE_MEMBER_CREATE_SUCCESS',
    member: member
  }
}

export const createPageMemberError = (message) => {
  return {
    type: 'PAGE_MEMBER_CREATE_ERROR',
    message: message
  }
}

export const updatePageMember = (pageId, member) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: this.getRequestUrl('/pages/' + pageId + '/members/'  + member.id, member),
      method: 'PUT',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadPageMembers(pageId));
          dispatch(updatePageMemberSuccess(response));
        }
        else {
          dispatch(updatePageMemberError(response.message));
        }
      }
    });
  });
}

export const updatePageMemberSuccess = (member) => {
  return {
    type: 'PAGE_MEMBER_UPDATE_SUCCESS',
    member: member
  }
}

export const updatePageMemberError = (message) => {
  return {
    type: 'PAGE_MEMBER_UPDATE_ERROR',
    message: message
  }
}

export const deletePageMember = (pageId, memberId) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages/' + pageId + '/members/' + memberId, {}),
      method: 'DELETE',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadPageMembers(pageId));
          dispatch(deletePageMemberSuccess(response));
        }
        else {
          dispatch(deletePageMemberError(response.message));
        }
      }
    });
  });
}

export const deletePageMemberSuccess = (member) => {
  return {
    type: 'PAGE_MEMBER_DELETE_SUCCESS',
    member: member
  }
}

export const deletePageMemberError = (message) => {
  return {
    type: 'PAGE_MEMBER_DELETE_ERROR',
    message: message
  }
}

// ***** Page stats management

export const loadPageStats = (pageId, period) => (dispatch) => {
  dispatch((dispatch) => {
    dispatch(fetchPageStatsStart());

    getResource({
      url: getRequestUrl('/pages/' + pageId + '/stats', {start: period.start, end: period.end}),
      method: 'GET',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          _updateUptime(response.uptime[0]);
          _updateCount(response.performance);
          _updateBytes(response.bytes);
          _updateCount(response.requests);

          dispatch(fetchPageStatsSuccess(response));
        }
        else {
          dispatch(fetchPageStatsError(response.errors));
        }
      }
    });
  });
}

const _updateUptime = (data) => {
  data.summary = Math.round(data.summary * 10000) / 100;
  for (let i = 0; i < data.values.length; i++) {
    data.values[i].value = Math.round(data.values[i].value * 10000) / 100;
  }
}

const _updateCount = (data) => {
  for (let iSeries = 0; iSeries < data.length; iSeries++) {
    let serie = data[iSeries];
    serie.summary = Math.round(serie.summary);
    for (let iValue = 0; iValue < serie.values.length; iValue++) {
      serie.values[iValue].value = Math.round(serie.values[iValue].value);
    }
  }
}

const _updateBytes = (data) => {
  for (let iSeries = 0; iSeries < data.length; iSeries++) {
    let serie = data[iSeries];
    serie.summary = Math.round(serie.summary*10/1024)/10;
    for (let iValue = 0; iValue < serie.values.length; iValue++) {
      serie.values[iValue].value = Math.round(serie.values[iValue].value*10/1024)/10;
    }
  }
}

export const fetchPageStatsStart = () => {
  return {
    type: 'PAGE_STATS_START'
  }
}

export const fetchPageStatsSuccess = (stats) => {
  return {
    type: 'PAGE_STATS_FETCH_SUCCESS',
    stats: stats
  }
}

export const fetchPageStatsError = (errors) => {
  return {
    type: 'PAGE_STATS_FETCH_ERROR',
    errors: errors
  }
}

export const loadLighthouseDetails = (pageId, period) => (dispatch) => {
  dispatch((dispatch) => {
    dispatch(fetchLighthouseDetailsStart());
    getResource({
      url: getRequestUrl('/pages/' + pageId + '/lighthouse', {start: period.start, end: period.end}),
      method: 'GET',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchLighthouseDetailsSuccess(response));
        }
        else {
          dispatch(fetchLighthouseDetailsError(response.errors));
        }
      }
    });
  });
}

export const fetchLighthouseDetailsStart = () => {
  return {
    type: 'LIGHTHOUSE_DETAILS_START'
  }
}

export const fetchLighthouseDetailsSuccess = (details) => {
  return {
    type: 'LIGHTHOUSE_DETAILS_FETCH_SUCCESS',
    details: details
  }
}

export const fetchLighthouseDetailsError = (errors) => {
  return {
    type: 'LIGHTHOUSE_DETAILS_FETCH_ERROR',
    errors: errors
  }
}

export const loadUptimeDetails = (pageId, period) => (dispatch) => {
  dispatch((dispatch) => {
    dispatch(fetchUptimeDetailsStart());
    getResource({
      url: getRequestUrl('/pages/' + pageId + '/uptime', {start: period.start, end: period.end}),
      method: 'GET',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchUptimeDetailsSuccess(response));
        }
        else {
          dispatch(fetchUptimeDetailsError(response.errors));
        }
      }
    });
  });
}

export const fetchUptimeDetailsStart = () => {
  return {
    type: 'UPTIME_DETAILS_START'
  }
}

export const fetchUptimeDetailsSuccess = (details) => {
  return {
    type: 'UPTIME_DETAILS_FETCH_SUCCESS',
    details: details
  }
}

export const fetchUptimeDetailsError = (errors) => {
  return {
    type: 'UPTIME_DETAILS_FETCH_ERROR',
    errors: errors
  }
}

export const loadAssetsDetails = (pageId, period) => (dispatch) => {
  dispatch((dispatch) => {
    dispatch(fetchAssetsDetailsStart());
    getResource({
      url: getRequestUrl('/pages/' + pageId + '/assets', {start: period.start, end: period.end}),
      method: 'GET',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchAssetsDetailsSuccess(response));
        }
        else {
          dispatch(fetchAssetsDetailsError(response.errors));
        }
      }
    });
  });
}

export const fetchAssetsDetailsStart = () => {
  return {
    type: 'ASSETS_DETAILS_START'
  }
}

export const fetchAssetsDetailsSuccess = (details) => {
  return {
    type: 'ASSETS_DETAILS_FETCH_SUCCESS',
    details: details
  }
}

export const fetchAssetsDetailsError = (errors) => {
  return {
    type: 'ASSETS_DETAILS_FETCH_ERROR',
    errors: errors
  }
}

// ***** Page budgets management

export const loadBudgets = (pageId) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages/' + pageId + '/budgets', {}),
      method: 'GET',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchBudgetsSuccess(response));
        }
        else {
          dispatch(fetchBudgetsError(response.errors));
        }
      }
    });
  });
}

export const fetchBudgetsSuccess = (budgets) => {
  return {
    type: 'BUDGETS_FETCH_SUCCESS',
    budgets: budgets
  }
}

export const fetchBudgetsError = (errors) => {
  return {
    type: 'BUDGETS_FETCH_ERROR',
    errors: errors
  }
}

export const createBudget = (pageId, category, item, budget) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages/' + pageId + '/budgets', { category: category, item: item, budget: budget }),
      method: 'POST',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadBudgets(pageId));
          dispatch(createBudgetSuccess());
        }
        else {
          dispatch(createBudgetError(response.errors));
        }
      }
    });
  });
}

export const createBudgetSuccess = () => {
  return {
    type: 'BUDGET_CREATE_SUCCESS'
  }
}

export const createBudgetError = (errors) => {
  return {
    type: 'BUDGET_CREATE_ERROR',
    errors: errors
  }
}

export const deleteBudget = (pageId, budgetId) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages/' + pageId + '/budgets/' + budgetId, {}),
      method: 'DELETE',
      onLoad(e) {
        let response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadBudgets(pageId));
          dispatch(deleteBudgetSuccess(response));
        }
        else {
          dispatch(deleteBudgetError(response.errors));
        }
      }
    });
  });
}

export const deleteBudgetSuccess = (budget) => {
  return {
    type: 'BUDGET_DELETE_SUCCESS',
    budget: budget
  }
}

export const deleteBudgetError = (errors) => {
  return {
    type: 'BUDGET_DELETE_ERROR',
    errors: errors
  }
}
