# Set build path to root folder.
cd ../..
# Build container
sudo docker build -f docker/nginx-gz/Dockerfile -t nsb:nginx-gz .
# Remove the old, if applicable
sudo docker container rm nsb
# Start the container, to test it. Note that we expose port 8080.
sudo docker run -p 8080:80 --name nsb --memory 16m nsb:nginx-gz