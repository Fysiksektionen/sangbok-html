# Used to test nginx configs.
# Set build path to root folder.
cd ../..
# Build container
sudo docker build -f docker/nginx/gz.Dockerfile -t sangbok:nginx-gz .
# Remove the old, if applicable
sudo docker container rm sbgz
# Start the container, to test it. Note that we expose port 8080.
sudo docker run -p 8080:80 --name sbgz --memory 16m sangbok:nginx-gz