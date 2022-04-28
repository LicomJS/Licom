#!/bin/bash

clean() {
    echo 'Clean workplace'

    rm release_chrome.zip
    rm release_firefox.zip
    rm -r build/
    rm -r dist/
    rm -r dist_firefox/
    rm -r public/
}

clean