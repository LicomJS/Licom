// eslint-disable-next-line no-unused-vars
browser.runtime.onMessage.addListener((msg) => {
  if (msg.action == "toggle") {
    let url = msg.url;
    toggle(url);
  }
});

var resizer = document.createElement("div");
resizer.style.position = "fixed";
resizer.style.top = "0px";
resizer.style.right = "0px";
resizer.style.zIndex = "9000000000000000000";
resizer.style.borderLeft = "0px";
resizer.style.background = "transparent";
resizer.style.height = "100%";
resizer.style.width = "0px";
resizer.style.cursor = "ew-resize";
resizer.style.transition = "left 0.2s, width 0.2s";

var iframe = document.createElement("iframe");
iframe.style.height = "100%";
iframe.style.width = "100%";
iframe.style.border = "0px";

function toggle(url) {
  if (resizer.style.width == "0px") {
    resizer.style.width = "400px";
    resizer.style.borderLeft = "5px solid #666";
    iframe.src = browser.runtime.getURL("index.html?url=" + url);
  } else {
    resizer.style.width = "0px";
    resizer.style.borderLeft = "0px";
  }
}

resizer.addEventListener("pointerdown", initResize);

let original_mouse_x;
let original_width;

function initResize(e) {
  e.preventDefault();
  resizer.style.transition = "";
  iframe.style.pointerEvents = "none";

  original_mouse_x = e.pageX;
  original_width = parseFloat(resizer.style.width.replace("px", ""));
  window.addEventListener("pointermove", Resize);
  window.addEventListener("pointerup", stopResize);
}

function Resize(e) {
  let width = original_width + (original_mouse_x - e.pageX);

  if (e.pageX > 20 && width > 250) {
    resizer.style.width = width + `px`;
  }
}

function stopResize() {
  iframe.style.pointerEvents = "all";
  resizer.style.transition = "left 0.2s, width 0.2s";

  window.removeEventListener("pointermove", Resize);
  window.removeEventListener("pointerup", stopResize);
}

resizer.appendChild(iframe);
document.body.appendChild(resizer);
