// eslint-disable-next-line no-unused-vars
browser.runtime.onMessage.addListener((msg) => {
  if (msg.action == "toggle") {
    let url = msg.url;
    toggle(url);
  }
});

var iframe = document.createElement("iframe");
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.style.border = "0px";
iframe.style.borderLeft = "1px solid #ccc";
// iframe.style.transition = "all 0.5s linear";
iframe.style.transition = "left 0.2s, width 0.2s";

function toggle(url) {
  if (iframe.style.width == "0px") {
    iframe.style.width = "400px";
    iframe.src = browser.runtime.getURL("index.html?url=" + url);
  } else {
    iframe.style.width = "0px";
  }
}

document.body.appendChild(iframe);
