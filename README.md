# Licom - comments on `every` webpage

![](https://shields.io/github/v/release/skorotkiewicz/Licom?display_name=tag&sort=semver)
![](https://shields.io/github/license/skorotkiewicz/Licom)

Licom is a simple plugin for your browser that adds the feature to leave comments on every page, even if it doesn't have that option itself.

Read others comments, vote and reply to them.

Available in light, dark mode and 5 languages :)

## Get from Store

<div style="display: flex; align-items: center;">

<a href="https://addons.mozilla.org/addon/licom/">
    <img src="firefox.png" alt="Firefox Store" />
</a>
<a href="https://chrome.google.com/webstore/detail/licom/kmjfgkpnlhgpfgacgmadpllppmcfbiok">
    <img src="chrome.png" alt="Chrome Web Store" />
</a>

</div>

## Features

- Thumbs up and down as vote.
- Comment editing.
- Replying to comments.
- Shrinking long comments and displaying comment after clicking on show more.
- Pagination, show older comments.
- Comment counter in browser extension icon.
- Revoke the vote of a comment.
- View sub pages from domain which were commented.
- Resize the panel width.
- Unique user Avatars.
- Spam dedection.

## Install development release

Go to the [releases](https://github.com/skorotkiewicz/Licom/releases) page and download the plugin for your browser.

Currently there are versions for Chrome and Firefox, if you use Opera, the plugin for Chrome will also work on your Opera browser.

- To install on Chrome/Opera, go to the add-ons screen `chrome://extensions/` and simply drag the add-on you downloaded into the window.

- To install on Firefox, open a window `about:debugging#/runtime/this-firefox` and click on temporarily load an add-on and select the downloaded add-on.

## Setup

### Developing server

```
$ cd server
$ pnpm install
$ mv dotenv .env
$ vim .env

# I use postgres, but you can easily use sqlite or mysql thanks to prisma.

$ docker-compose up
$ pnpm dev # to start server with nodemon
$ pnpm start
```

## Users

Chrome  
![](https://shields.io/chrome-web-store/users/kmjfgkpnlhgpfgacgmadpllppmcfbiok)

Firefox  
![](https://shields.io/amo/users/licom)

## Contributing

If you want to help develop Licom, feel free to add a new PR! I'm happy for any help!
