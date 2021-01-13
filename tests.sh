# !/bin/sh
URL=http://localhost:8088
GQL=$URL/graphql

NAME=login1
PASS=password1

curl -H "Authorization: Bearer fa899e9278295939228c6cb5011e04041cfc3280e4d1c7062c0337ae63031ff4" -H "X-Progress-ID: 81fc512a-4236-11eb-96d1-975577b0463c" $GQL

#curl -H "Authorization: Bearer fa899e9278295939228c6cb5011e04041cfc3280e4d1c7062c0337ae63031ff4" -H "X-Progress-ID: 81fc512a-4236-11eb-96d1-975577b0463c" $URL/upload-progress