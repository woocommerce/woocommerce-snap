#!/bin/bash

echo "Stopping containers and removing volumes"
docker-compose -f ./env/docker-compose.yml down -v