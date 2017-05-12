#!/bin/bash

git pull || true
cd "back"
npm install || true
cd "../front"
bower install || true
cd "../back" 
node index.js