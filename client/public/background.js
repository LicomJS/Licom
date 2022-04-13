chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;

    chrome.tabs.sendMessage(tab.id, { action: "toggle", url });
  });
});
