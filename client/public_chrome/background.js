chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;

    chrome.tabs.sendMessage(tab.id, { action: "toggle", url });
  });
});

let lastUrl;

function getTabInfo() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;

    if (lastUrl !== url) {
      chrome.action.setBadgeText({ text: "" });

      lastUrl = url;
      fetch("https://licom.fly.dev/api/count", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ url }),
      })
        .then((r) => r.json())
        .then((d) => {
          chrome.action.setBadgeText({ text: String(d.count ?? "") });
        });
    }
  });
}

chrome.tabs.onActivated.addListener(() => {
  getTabInfo();
});

chrome.tabs.onUpdated.addListener(() => {
  getTabInfo();
});
