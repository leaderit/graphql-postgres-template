# !/bin/sh
C_NORMAL="\x1B[0m"
C_GREEN="\x1B[32m"

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
printf %s " ${C_GREEN}done${C_NORMAL}"

# database and metadata
./hasura-cli migrate apply
./hasura-cli metadata apply
./hasura-cli seeds apply

# Run tests
./run-tests

