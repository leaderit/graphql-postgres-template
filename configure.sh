# !/bin/sh
# Set project name to current directory name
PROJECT=$(pwd | grep -o '[^/]*$')

git clone https://github.com/leaderit/graphql-postgres-template.git .

cp env-example .env
cp server/env-example server/.env
# EDIT .env  and set NAME variable to "my-project"
sed -i "s/NAME=.*/NAME=$NAME/" .env 

# set other variables in apropriate values, espetialy passwords
cd server
npm install
cd ..
docker-compose up -d

# database and metadata
./hasura-cli migrate apply
./hasura-cli metadata apply
./hasura-cli seeds apply

# Run tests
./run-tests

