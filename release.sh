#!/bin/bash

TAG=$(git describe --exact-match HEAD 2>/dev/null)
if [ -z "$TAG" ]
then
  echo "Skipping release: no git tag found."
  exit 0
fi

echo TAG = \"$TAG\"
mkdir -p release
sed -e "s/branch = '.\+'/tag = '$TAG'/g" \
    -e "s/version = 'scm-1'/version = '$TAG-1'/g" \
    frontend-core-scm-1.rockspec > release/frontend-core-$TAG-1.rockspec

tarantoolctl rocks make release/frontend-core-$TAG-1.rockspec
tarantoolctl rocks pack frontend-core $TAG && mv frontend-core-$TAG-1.all.rock release/