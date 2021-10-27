#!/usr/bin/env bash

##
## Help printout
##
if [[ $*\  == *--help\ * || $*\  == *-h\ * ]]; then
    echo -e "Användning: ./convert.sh [OPTION]..."
    echo -e "Konverterar .mscz-filer i mscz-mappen till svg:er, vilka lagras i mappen svg/. Bör köras från music/-mappen."
    echo -e "\nFlaggor:"
    echo -e "\t-c, --compress\tKomprimera svg-filerna"
    echo -e "\t-f, --force\tTvinga omgenerering av existerande filer"
    echo -e "\t--no-generate\tGenerara inga nya noter"
    echo -e "\t--no-hash\tInkludera inte en checksum i filnamnet"
    echo -e "\t--no-json\tStrunta i att generera svgs.json"
    echo -e "\t--no-move\tFlytta inte filerna till deras målmappar (för användning med Vue)"
    exit 0
fi

##
## Cleanup and directory creation
##
mkdir -p svg
if [[ $*\  == *--force\ * ]]; then
    rm svg/*.svg
fi


##
## Generate svg:s
##
export QT_QPA_PLATFORM=offscreen
SCALE_FACTORS=(1 1.25 1.5 1.75 2 3 4)

if [[ ! $*\  == *--no-generate\ * ]]; then
    echo -e "\e[1;32mGenererar SVG-filer:\e[0m"
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
                # Generate svg
                mscore3 --export-to "svg/${file//.mscz/}${csum:0:8}-sf$sf.svg" "tmp/${file//mscz/tmp.mscx}" --force --trim-image 140 || exit 1;
            done
        done
    done
fi

# Cleanup
rm -rf tmp


##
## Compress svg:s
##
if [[ $*\  == *--compress\ *  || $*\  == *-c\ * ]]; then
    echo -e "\e[1;32mKomprimerar filer:\e[0m"
    cd svg
    for file in *.svg
    do
        if [[ $file =~ ".min.svg" ]]; then
            echo -e "$file är redan komprimerad."
        else
            svgo --input "$file" --output "${file//.svg/.min.svg}" --multipass || echo -e "\e[31mKomprimering misslyckades\e[0m för $file."
            rm "$file" # Remove old, non-compressed file
        fi
    done
    cd ..
fi

##
## Generate svgs.json (a list of all available svg sheet music files)
##
if [[ ! $*\  == *--no-json\ * ]]; then
    echo -e "\e[1;32mGenererar svgs.json\e[0m"
    cd svg
    svgs="["
    for file in *.svg
    do
        svgs="$svgs\"$file\","
    done
    svgs="${svgs%?}]"
    cd ..
    echo $svgs > svgs.json
fi


if [[ ! $*\  == *--no-move\ * ]]; then
    echo -e "\e[1;32mFlyttar filer\e[0m till deras målmapp (så att Vue kan använda dem)."
    mkdir -p ../public/msvg/

    cp svgs.json ../src/assets/msvgs.json
    cp svg/* ../public/msvg/
fi

# Only create a cache if we reconverted from scratch and compressed everything.
if [[ $*\  == *--force\ * && $*\  == *--compress\ * ]]; then
    echo -e "\e[1;32mSkapar cache.\e[0m"
    tar -cJf svg.tar.lzma svg/*
fi