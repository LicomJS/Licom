# Licom - comments on `every` webpage

Licom is a simple plugin for your browser that adds the feature to leave comments on every page, even if it doesn't have that option itself.

Read others comments, vote and reply to them.

Available in light, dark mode and 5 languages :)

## Install release

From:

[![Firefox Store](firefox.png)](https://addons.mozilla.org/addon/licom/) [![Chrome Web Store](chrome.png)](https://chrome.google.com/webstore/detail/licom/kmjfgkpnlhgpfgacgmadpllppmcfbiok)

Or:

Go to the [releases](https://github.com/skorotkiewicz/Licom/releases) page and download the plugin for your browser.

Currently there are versions for Chrome and Firefox, if you use Opera, the plugin for Chrome will also work on your Opera browser.

- To install on Chrome/Opera, go to the add-ons screen `chrome://extensions/` and simply drag the add-on you downloaded into the window.

- To install on Firefox, open a window `about:debugging#/runtime/this-firefox` and click on temporarily load an add-on and select the downloaded add-on.

## Setup

### Developing server

```
$ cd server
# yarn install
$ mv dotenv .env
$ vim .env

# I use postgres, but you can easily use sqlite or mysql thanks to prisma.
# because it is the fastest and has a convenient client for macos `postico`.

$ cd server/
$ docker-compose up
$ yarn dev # to start server with nodemon
$ yarn start

### to start deploy server, fly.io start my server with the Dockerfile, also check the Dockerfile.
### somehow there is no magic when starting the server :)
```

## Contributing

If you want to help develop Licom, feel free to add a new PR! I'm happy for any help!
