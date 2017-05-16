#!/bin/bash

git pull || true
cd "back"
npm install || true
cd "../front"
bower --allow-root install || true
cd "../back" 
node index.js