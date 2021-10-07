cd ../..
sudo docker build -f docker/nginx-gz/Dockerfile -t nsb:nginx-gz .
sudo docker container rm nsb
sudo docker run -p 8080:80 --name nsb --memory 16m nsb:nginx-gz