#!/bin/bash
buildBranch="customer/bhappy"
#echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

branch=`git rev-parse --abbrev-ref HEAD`
echo $branch
#echo $buildBranch

if [[ $branch == $buildBranch ]]; then
  echo "✅ - Build can proceed"
  exit 1;
else
  echo "🛑 - Build cancelled"
  exit 0;
fi