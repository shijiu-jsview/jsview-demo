#!/bin/bash

echo Remove previous node_modules
rm -rf node_modules

echo Restore package-lock.json
cp package-lock.json-perfect package-lock.json

echo npm install to recovery node_modules
npm install

