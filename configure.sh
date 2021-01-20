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
docker-compose up -d

# Waiting until services will start fully
STARTED=NO
echo Waiting for start services ...
until [ "$STARTED" = "OK" ]
do
    STARTED=$(curl  -f -s http://localhost:8088/hasura/healthz)
    echo /$STARTED/
    sleep 3
done
sleep 15
echo OK

# database and metadata
./hasura-cli migrate apply
./hasura-cli metadata apply
./hasura-cli seeds apply

# Run tests
./run-tests

