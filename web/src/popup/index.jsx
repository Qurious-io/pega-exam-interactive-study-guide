import React from "react";
import { render } from "react-dom";

const STORAGE_KEY = "pega-study-guide_STATE";

function ControlPanel({ state }) {
  return (
    <div>
      <h1>Study guide</h1>
      <button
        onClick={() => {
          chrome.runtime.sendMessage({ cmd: "start" });
        }}
      >
        Start
      </button>
    </div>
  );
}

window.onload = () => {
  render(<ControlPanel state={{}} />, document.getElementById("app"));
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {});
