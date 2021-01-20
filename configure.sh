# !/bin/sh
# Text color
C_NRM="\033[0m"
C_BLK="\033[30m"
C_RED="\033[31m"
C_GRN="\033[32m"
C_YEL="\033[33m"
C_BLU="\033[34m"
C_MAG="\033[35m"
C_CYN="\033[36m"
C_WHT="\033[37m"
# Text backgound
B_NRM="\033[0m"
B_RED="\033[41m"
B_GRN="\033[42m"
B_YEL="\033[43m"
B_BLU="\033[44m"
B_MAG="\033[45m"
B_CYN="\033[46m"
B_WHT="\033[47m"

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
echo  -e "${C_GRN} done ${C_NRM}"

# database and metadata
./hasura-cli migrate apply
./hasura-cli metadata apply
./hasura-cli seeds apply

# Run tests
./run-tests

