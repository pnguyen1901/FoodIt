#!/bin/bash
      # Helper script for Gradle to call node on macOS in case it is not found
      export PATH=$PATH:/Users/phatnguyen/.nvm/versions/node/v12.12.0/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/phatnguyen/Documents/FoodIt/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/phatnguyen/Documents/FoodIt/node_modules/.bin:/Users/phatnguyen/Downloads/google-cloud-sdk/bin:/Users/phatnguyen/.nvm/versions/node/v12.12.0/bin:/miniconda3/bin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/share/dotnet:~/.dotnet/tools:/Library/Apple/usr/bin:/Library/Frameworks/Mono.framework/Versions/Current/Commands
      node $@
    