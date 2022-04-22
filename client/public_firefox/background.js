browser.browserAction.onClicked.addListener(() => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    var tab = tabs[0];
    var url = tab.url;

    browser.tabs.sendMessage(tabs[0].id, { action: "toggle", url });
  });
});

let lastUrl;

function getTabInfo() {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    var tab = tabs[0];
    var url = tab.url;

    if (lastUrl !== url) {
      browser.browserAction.setBadgeText({ text: "" });

      lastUrl = url;
      fetch("https://licom.fly.dev/api/count", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ url }),
      })
        .then((r) => r.json())
        .then((d) => {
          browser.browserAction.setBadgeText({ text: String(d.count ?? "") });
        });
    }
  });
}

browser.tabs.onActivated.addListener(() => {
  getTabInfo();
});

browser.tabs.onUpdated.addListener(() => {
  getTabInfo();
});
