##
## Help printout
##
if [[ $*\  == *--help\ * || $*\  == *-h\ * ]]; then
    echo -e "Användning: ./convert.sh [OPTION]..."
    echo -e "Konverterar .mscz-filer i mscz-mappen till svg:er, vilka lagras i mappen svg/. Bör köras från music/-mappen."
    echo -e "\nFlaggor:"
    echo -e "\t-c, --compress\tKomprimera svg-filerna"
    echo -e "\t--no-hash\tInkludera inte en checksum i filnamnet"
    echo -e "\t--no-json\tStrunta i att generera svgs.json"
    echo -e "\t--no-move\tFlytta inte filerna till deras målmappar (för användning med Vue)"
    exit 0
fi


# Cleanup and directory creation
mkdir -p svg
rm svg/*.svg

##
## Generate svg:s
##
export QT_QPA_PLATFORM=offscreen
SCALE_FACTORS=(1 1.25 1.5 1.75 2 3 4)

echo -e "\e[1;32mGenererar SVG-filer:\e[0m"
for path in mscz/*.mscz
do
    file=$(basename "$path")
    echo -e " - \e[34m$file\e[0m"
    # Extract the source file, so that we can modift the scale factor before rendering.
    unzip -o "mscz/$file" "${file//mscz/mscx}" -d "tmp"

    for sf in "${SCALE_FACTORS[@]}"
    do
        # TODO: if we are using hash, and a generated image has already been found, don't regenerate it unless we force it with a flag.
        if [[ ! $*\  == *--no-hash\ * ]]; then csum="" else; csum="."$(sha1sum "mscz/$file");fi
        sed -e "s/<Spatium>[0-9]\.[0-9]*<\/Spatium>/<Spatium>$sf<\/Spatium>/g" "tmp/${file//mscz/mscx}" > "tmp/${file//mscz/tmp.mscx}"
        mscore3 --export-to "svg/${file//.mscz/}-sf$sf${csum:0:8}.svg" "tmp/${file//mscz/tmp.mscx}" --force --trim-image 140
    done
done

##
## Compress svg:s
##
if [[ $*\  == *--compress\ *  || $*\  == *-c\ * ]]; then
    echo -e "\e[1;32mKomprimerar filer:\e[0m"
    cd svg
    for file in *.svg
    do
        echo -e " - \e[34m$file\e[0m"
        svgo -i "$file" || echo -e "\e[31mKomprimering misslyckades\e[0m för $file."
        #scour -i "$file" -o "${file%.*}.min.svg" || echo -e "\e[31mKomprimering misslyckades\e[0m för $file."
    done
    cd ..
fi

##
## Generate svgs.json
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

## Cleanup
rm -rf tmp
