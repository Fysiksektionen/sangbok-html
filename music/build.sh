./convert.sh
./compress.sh

mkdir -p ../public/msvg/

cp svgs.json ../src/assets/msvgs.json
cp svg/* ../public/msvg/