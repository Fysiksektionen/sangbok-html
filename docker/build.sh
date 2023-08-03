#!/usr/bin/env bash

# Example build script. The result is found in the /dist folder.
# Takes sheet music directly from the cache without checking for updated sheet music.

# Remove any old sheet music files (probably not necessary)
rm -rf music/svg;

# Unpack cached sheet music and move it to where it is included in the build
tar -xJf music/svg.tar.lzma;
mv svg public/msvg;

# Move the information on current sheet music so that the build script can find them
cp music/svgs.json src/assets/msvgs.json;

# Build the script.
npm run build