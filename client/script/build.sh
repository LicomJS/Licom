#!/bin/bash

build() {
    echo 'Building Extension in React'

    rm dist.zip
    rm -rf dist/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    react-scripts build

    mkdir -p dist
    cp -r build/* dist

    zip -r dist.zip dist/* > /dev/null 2>&1
}

build