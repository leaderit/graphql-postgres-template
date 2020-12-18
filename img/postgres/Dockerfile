FROM postgres:12

LABEL maintainer="V.Grazhdankin"

#ENV SFCGAL_VERSION master

RUN set -ex \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
      curl \
      mc \
      postgresql-contrib

RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./initdb.sh /docker-entrypoint-initdb.d/10_uuid.sh

