#!/bin/bash

latesttag=$(git describe --tags)
if [ -z ${latesttag} ]
then
  echo "Failed to retrieve tags"
  exit 1
fi

echo checking out ${latesttag}
git checkout ${latesttag}
cd back
npm install
cd ../front
bower install

