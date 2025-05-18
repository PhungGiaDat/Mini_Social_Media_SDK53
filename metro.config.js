// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for importing from node_modules
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs'];

// Add support for importing from node_modules
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

// Add support for importing from node_modules
config.resolver.nodeModulesPaths = [__dirname + '/node_modules'];

// Add extraNodeModules for problematic dependencies
config.resolver.extraNodeModules = {
  'idb': path.resolve(__dirname, 'node_modules/idb'),
};

// Add additional module resolution
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'idb') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/idb/build/index.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.unstable_enablePackageExports = false;

module.exports = config;