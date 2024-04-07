#!/usr/bin/env bash

##
## Help printout
##
if [[ $*\  == *--help\ * || $*\  == *-h\ * ]]; then
    echo -e "Användning: ./generate_mxl.sh [OPTION]..."
    echo -e "Konverterar .mscz-filer i mscz-mappen till MusicXML-filer, vilka lagras i mappen mxl/. Bör köras från music/-mappen."
    echo -e "\nFlaggor:"
fi

##
## Generate svg:s
##¨
SCALE_FACTORS=(1 1.25 1.5 1.75 2 3 4)
if [[ ! $*\  == *--no-generate\ * ]]; then
    echo -e "\e[1;32mGenererar MXL-filer:\e[0m"
    for path in mscz/*.mscz
    do
        file=$(basename "$path")
        echo -e " - \e[34m$file\e[0m"

        # Clear old files in tmp dir.
        rm tmp/*.mscx

        # Extract the source file, so that we can modify the scale factor before rendering.
        # Note that the internal .mscx file does not neccessarily correspond to the .mscz file name if the .mscz has been renamed after saving.
        unzip -o "mscz/$file" *.mscx -d "tmp" || exit 3;

        
        for sf in "${SCALE_FACTORS[@]}"
        do
            if [[ $*\  == *--no-hash\ * ]]; then
                # Set hash to empty.
                csum=""
            else
                # Check if another file with the same checksum exists.
                # If it's found, use the old file.
                csum="."$(sha1sum "mscz/$file")
                if ls svg/*${csum:0:8}-sf$sf-*.svg > /dev/null 2>&1
                then
                    continue
                fi
            fi
            
            for tmpfile in tmp/*.mscx # Find whatever the .mscx file is called (there should only be one).
            do
                # Modify the scaling factor and the page height in order to get the desired zoom level in a single svg file.
                sed -e "s/<Spatium>[0-9]\.[0-9]*<\/Spatium>/<Spatium>$sf<\/Spatium>/g" "$tmpfile" \
                    | sed -e "s/<pageHeight>[0-9]*\.[0-9]*<\/pageHeight>/<pageHeight>1000<\/pageHeight>/g" \
                    > "tmp/${file//mscz/tmp.mscx}" \
                    || exit 3
                # Prevent musescore from trying to open the above file if it's not 100% finished. Makes the script more stable.
                sleep 0.2
                # Generate svg
                # If this fails, check if the file was saved with MuseScore 3 (not 4 and above).
                # This can also fail if the target directory does not exist.
                mscore3 --force --export-to "mxl/${file//.mscz/}.mxl" "tmp/${file//mscz/tmp.mscx}" || exit 1;
                # mscore3 --force --export-to "xml/${file//.mscz/}.xml" "tmp/${file//mscz/tmp.mscx}" || exit 1;
            done
        done
    done
fi

# Cleanup
rm -rf tmp

##
## Generate svgs.json (a list of all available svg sheet music files)
##
if [[ ! $*\  == *--no-json\ * ]]; then
    echo -e "\e[1;32mGenererar mxls.json\e[0m"
    cd mxl
    mxls="["
    for file in *.mxl
    do
        mxls="$mxls\"$file\","
    done
    mxls="${mxls%?}]"
    cd ..
    echo $mxls > mxls.json
    cp mxls.json ../src/assets/mxls.json
fi