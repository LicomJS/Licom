#!/bin/bash

build() {
    echo 'Building Extension in React'

    rm -rf dist/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    react-scripts build

    mkdir -p dist
    cp -r build/* dist

    # mv dist/index.html dist/popup.html
}

build