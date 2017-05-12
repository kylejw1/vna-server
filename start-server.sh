#!/bin/bash

git pull
cd "back"
npm install
cd "../front"
bower install
cd "../back" 
node index.js