cd ../..
sudo docker build -f docker/statigz/Dockerfile -t nsb:statigz .
sudo docker container rm nsb
sudo docker run -p 8080:80 --name nsb --memory 16m nsb:statigz