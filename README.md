
## docker up                                                                                                             0.9s
docker compose -f docker-compose-arm.yml up  --build -d
docker compose -f docker-compose-intel.yml up  --build -d

## docker down
docker compose -f docker-compose-arm.yml down
docker compose -f docker-compose-intel.yml down


## docker run mongo databse
docker compose -f docker-compose-mongo.yml up  --build -d

# down
docker compose -f docker-compose-mongo.yml down

# docker exec mongo
 sudo docker exec -it mongodb sh

 # Nginx Proxy Manager
 Email:    admin@example.com
 Password: changeme