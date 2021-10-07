cd ../..
sudo docker build -f docker/nginx/Dockerfile -t nsb:nginx-pc .
sudo docker container rm nsb
sudo docker run -p 8080:80 --name nsb --memory 16m nsb:nginx-pc