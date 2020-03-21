#!/bin/bash

echo Remove previous node_modules
rm -rf node_modules

echo Remove previous package-lock.json
rm -rf package-lock.json

echo npm install to recovery node_modules
npm install

echo apply patch
cd patch_package
./update.sh
cd ..