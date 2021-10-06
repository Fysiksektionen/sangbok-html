cd ../..
sudo docker build -f deploy/nginx/Dockerfile -t nsb:nginx .
sudo docker container rm nsb
sudo docker run -p 8080:80 --name nsb --memory 16m nsb:nginx