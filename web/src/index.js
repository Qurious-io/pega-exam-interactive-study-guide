function useState(defaultState, onStateChange) {
  let state = defaultState;

  function setState(newState) {
    state = {...state, ...newState};
    onStateChange();
  }

  return [setState];
}

const [setState] = useState(loadState());

const DEFAULT_STATE = {
  current: 0,
  articles: [],
};

const LOCAL_STORAGE_KEY = "pega-quiz-study__STATE";

function loadState() {
  return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
}

function saveState(state) {
  return window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

function loadPage(url) {
  window.location = url;
}
