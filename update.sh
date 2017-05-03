#!/bin/bash

latesttag=$(git describe --tags)
if [ -z ${latesttag} ]
then
  echo "Failed to retrieve tags"
  exit 1
fi

git checkout release
git pull
cd back
npm install
cd ../front
bower install

