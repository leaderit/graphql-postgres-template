# !/bin/sh
# Set project name to current directory name
PROJECT=$(pwd | grep -o '[^/]*$')

git clone https://github.com/leaderit/graphql-postgres-template.git .

cp env-example .env
cp server/env-example server/.env
# EDIT .env  and set NAME variable to "my-project"
sed -i '' -e "s/NAME=.*/NAME=$PROJECT/" .env 

# set other variables in apropriate values, espetialy passwords
cd server
npm install
cd ..
docker-compose down
docker-compose build
docker-compose up -d

# Waiting until services will start fully
STARTED=NO
printf %s "Waiting for start GraphQL services "
until [ "$STARTED" = "OK" ]
do
    STARTED=$(curl  -f -s http://localhost:8088/hasura/healthz)
    printf %s "." 
    sleep 1
done
echo " done "
# echo "\033[32m done \033[0m"

# database and metadata
./hasura-cli migrate apply
./hasura-cli metadata apply
./hasura-cli seeds apply

# Run tests
./run-tests

