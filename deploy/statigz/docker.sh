cd ../..
sudo docker build -f deploy/statigz/Dockerfile -t nsb:statigz .
sudo docker container rm nsb
sudo docker run -p 8080:80 --name nsb --memory 16m nsb:statigz