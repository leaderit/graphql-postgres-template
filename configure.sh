# !/bin/sh

PROJECT=my-project

# Prepare your project directory
# mkdir my-project
# cd my-project 
# git clone https://github.com/leaderit/graphql-postgres-template.git .

cp env-example .env
cp server/env-example server/.env
# EDIT .env  and set NAME variable to "my-project"
# set other variables in apropriate values, espetialy passwords
cd server
npm install
cd ..
docker-compose up -d

# database and metadata
