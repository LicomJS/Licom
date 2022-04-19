browser.browserAction.onClicked.addListener(() => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    var tab = tabs[0];
    var url = tab.url;

    browser.tabs.sendMessage(tabs[0].id, { action: "toggle", url });
  });
});
