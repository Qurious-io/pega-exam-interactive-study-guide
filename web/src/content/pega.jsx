import React from "react";
import { render } from "react-dom";

window.onload = () => {
  console.log("Loading pega study guide analyzer");
  initPage();
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[pega-content] message recv", message);
    switch (message.cmd) {
      case "done": {
        document.body.innerHTML = "";
        const reactContainer = document.createElement("div");
        document.body.append(reactContainer);
        const { articles, correct } = message.payload;
        render(
          <ReviewList articles={articles} correct={correct} />,
          reactContainer
        );
        break;
      }
      default:
        break;
    }
  });
};

function ActionList() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        borderBottom: "3px solid #f1f1f1",
        height: "3rem",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#ff618d",
          color: "white",
          padding: "0.2rem 0.8rem",
          borderRadius: "10px",
          margin: "0 2rem",
          fontSize: "13px",
          textTransform: "uppercase",
        }}
        onClick={() => {
          chrome.runtime.sendMessage({
            cmd: "answer",
            payload: { correct: 0 },
          });
          document.body.innerHTML = "";
        }}
      >
        I failed
      </div>
      <div
        style={{
          background: "#51e56a",
          color: "white",
          padding: "0.2rem 0.8rem",
          borderRadius: "10px",
          margin: "0 2rem",
          fontSize: "13px",
          textTransform: "uppercase",
        }}
        onClick={() => {
          chrome.runtime.sendMessage({
            cmd: "answer",
            payload: { correct: 1 },
          });
          document.body.innerHTML = "";
        }}
      >
        I got it right
      </div>
      <div
        style={{
          background: "#b5b5b5",
          color: "white",
          padding: "0.2rem 0.8rem",
          borderRadius: "10px",
          margin: "0 2rem",
          fontSize: "13px",
          textTransform: "uppercase",
        }}
        onClick={() => {
          chrome.runtime.sendMessage({
            cmd: "answer",
            payload: { correct: -1 },
          });
          document.body.innerHTML = "";
        }}
      >
        Ignore
      </div>
    </div>
  );
}

function ReviewList({ articles, correct }) {
  console.log(articles, correct);
  const numRight = correct.filter((c) => c === 1).length;
  const numTotal = articles.filter((_, i) => correct[i] !== -1).length;
  const score = numTotal === 0 ? 100 : Math.floor((numRight / numTotal) * 100);
  const testResult = score >= 60 ? "PASSED" : "FAILED";
  return (
    <div>
      <button
        onClick={() => {
          chrome.runtime.sendMessage({ cmd: "review" });
        }}
      >
        Review
      </button>
      <p>
        You <b>{testResult}</b>
      </p>
      <p>
        Your score: <b>{score}%</b>
      </p>
      {articles.map((article, i) => (
        <div key={article.url}>
          URL {article.url} did pass{" "}
          <b>
            {correct[i] === 1 ? "YES" : correct[i] === 0 ? "NO" : "IGNORED"}
          </b>
        </div>
      ))}
    </div>
  );
}

function initPage() {
  const reactContainer = document.createElement("div");
  const container = document.createElement("div");
  Object.assign(container.style, {
    margin: "3rem auto 0 auto",
    width: "800px",
    display: "flex",
    flexDirection: "column",
  });
  const embeds = document.querySelectorAll("iframe.h5p-iframe");
  for (let i = 0; i < embeds.length; i++) {
    embeds[i].parentElement.removeChild(embeds[i]);
    // "de-initialize" by removing the class
    embeds[i].className = "h5p-iframe";
    Object.assign(embeds[i].style, {
      margin: "3rem 0",
    });
    container.append(embeds[i]);
  }
  document.body.innerHTML = "";
  document.body.append(reactContainer);
  document.body.append(container);
  // hack to reload all embedded content
  const h5pScript = document.createElement("script");
  h5pScript.innerHTML = "(function(h5p) { h5p.init(); })(window.H5P);";
  document.head.appendChild(h5pScript);
  render(<ActionList />, reactContainer);
}
