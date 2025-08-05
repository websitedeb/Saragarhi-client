const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.watchFolders = config.watchFolders.filter(
  folder => !folder.includes('src-tauri')
);

config.resolver.blockList = [
  /src-tauri\/.*/,
];

module.exports = config;
 
module.exports = withNativeWind(config, { input: './global.css' })