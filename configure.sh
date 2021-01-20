# !/bin/sh
C_NORMAL="\x1B[0m"
C_RED="\x1B[31m"
C_GREEN="\x1B[32m"
C_YELLOW="\x1B[33m"
C_BLUE="\x1B[34m"
C_MAGENTA="\x1B[35m"
C_CYAN="\x1B[36m"
C_WHITE="\x1B[37m"
# 
KNRM="\x1B[0m"
KRED="\x1B[31m"
KGRN="\x1B[32m"
KYEL="\x1B[33m"
KBLU="\x1B[34m"
KMAG="\x1B[35m"
KCYN="\x1B[36m"
KWHT="\x1B[37m"

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

