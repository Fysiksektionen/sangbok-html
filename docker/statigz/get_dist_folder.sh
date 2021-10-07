# sudo apt-get update && sudo apt-get install brotli

cp -r ../../dist dist

for file in dist/**/*; do \
    brotli "$file" -9 --rm; \
done
for file in dist/*; do \
    brotli "$file" -9 --rm; \
done