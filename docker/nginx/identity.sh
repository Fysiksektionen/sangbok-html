# Used to test pwa and the docker build process. Does not compress anything. Not for production use.

# Set build path to root folder.
cd ../..
# Build container
sudo docker build -f docker/nginx/identity.Dockerfile -t sangbok:nginx-identity .

# Remove the old, if applicable
sudo docker container rm sbi

# Start the container, to test it. Note that we expose port 8080.
sudo docker run -p 8080:80 --name sbi --memory 16m sangbok:nginx-identity
