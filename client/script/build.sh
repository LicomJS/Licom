#!/bin/bash

build() {
    echo 'Building Extension in React'

    rm dist_chrome.zip
    rm dist_firefox.zip
    rm -r dist/
    rm -r dist_firefox/
    rm -r public/

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    # chrome
    cp -a public_chrome/ public/
    react-scripts build

    mkdir dist/
    cp -r build/* dist/
    cd dist; zip -r ../release_chrome.zip ./* ; cd -

    # firefox
    mkdir dist_firefox/
    cp -a dist/{static,asset-manifest.json} dist_firefox/
    cp public_firefox/* dist_firefox/ 
    rm dist_firefox/index.html
    cp dist/index.html dist_firefox/

    cd dist_firefox; zip -r ../release_firefox.zip ./* ; cd -

}

build