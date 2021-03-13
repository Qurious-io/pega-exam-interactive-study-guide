import articlesData from "../data/articles.json";

import { shuffle } from "./utils";

let state = {
  current: 0,
  articles: [],
  // 1  - correct
  // 0  - incorrect
  // -1 - irrelevant, skip
  correct: [],
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[background] message recv", message);
  switch (message.cmd) {
    case "start": {
      state = {
        ...state,
        current: 0,
        articles: shuffle(articlesData),
        correct: [],
      };
      chrome.tabs.create({
        active: true,
        url: state.articles[state.current].url,
      });
      break;
    }
    case "answer": {
      state = {
        ...state,
        current: state.current + 1,
        correct: [...state.correct, message.payload.correct],
      };
      // check if it's the last question
      if (state.articles.length <= state.correct.length) {
        chrome.tabs.sendMessage(sender.tab.id, {
          cmd: "done",
          payload: {
            correct: state.correct,
            articles: state.articles,
          },
        });
      } else {
        chrome.tabs.update(sender.tab.id, {
          active: true,
          url: state.articles[state.current].url,
        });
      }
      break;
    }
    case "review": {
      const articlesToReview = state.articles.filter(
        (_, i) => state.correct[i] === 0
      );
      state = {
        ...state,
        current: 0,
        articles: shuffle(
          articlesToReview.length > 0 ? articlesToReview : articlesData
        ),
        correct: [],
      };
      chrome.tabs.create({
        active: true,
        url: state.articles[state.current].url,
      });
      break;
    }
    default:
      break;
  }
});
