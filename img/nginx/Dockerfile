# Фаза сборки необходимых дополнительных модулей
FROM nginx:alpine as builder
# FROM nginx:alpine

# SHELL TOOLS
RUN apk add bash mc
SHELL ["/bin/bash", "-c"]

# INSTALL BUILD TOOLS
RUN set -x \
    && apk add --no-cache --virtual .build-deps \
        gcc \
        libc-dev \
        make \
        openssl-dev \
        pcre-dev \
        zlib-dev \
        linux-headers \
        libxslt-dev \
        gd-dev \
        geoip-dev \
        perl-dev \
        libedit-dev \
        mercurial \
        bash \
        alpine-sdk \
        findutils 

# DOWNLOAD NGINX
# DOWNLOAD AND MAKE MODULES
RUN set -x \
    && tempDir="/usr/local/src" \
    && mkdir -p $tempDir \
    && chown nobody:nobody $tempDir \
    && export HOME=${tempDir} \
    && cd ${tempDir} \
    \
    && curl -fSL "https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz" |  tar -C ${tempDir} -xzvf- \
    && ln -s nginx-$NGINX_VERSION nginx \
    && configure_args=$(nginx -V 2>&1 | grep "configure arguments:" | awk -F 'configure arguments:' '{print $2}') \
    \
    && curl -fSL "https://github.com/fdintino/nginx-upload-module/archive/2.3.0.tar.gz" |  tar -C ${tempDir} -xzvf- \
    && module_dir=../nginx-upload-module-2.3.0/ \
    && configure_args="${configure_args} --add-dynamic-module=${module_dir}" \
    \
    && curl -fSL "https://github.com/masterzen/nginx-upload-progress-module/archive/v0.9.2.tar.gz" |  tar -C ${tempDir} -xzvf- \
    && module_dir=../nginx-upload-progress-module-0.9.2/ \
    && configure_args="${configure_args} --add-dynamic-module=${module_dir}" \
    \
    && curl -fSL "https://github.com/openresty/redis2-nginx-module/archive/v0.15.tar.gz" |  tar -C ${tempDir} -xzvf- \
    && module_dir=../redis2-nginx-module-0.15/ \
    && configure_args="${configure_args} --add-dynamic-module=${module_dir}" \
    \    
    && cd nginx \
    && eval "./configure ${configure_args}" \
    && make modules \
    && sign_nginx=$(strings /usr/sbin/nginx| fgrep '8,4,8') \
    && for f in objs/*.so; do if [ "$sign_nginx" != "$(strings $f | fgrep '8,4,8')" ]; then echo ERROR BUILD $f; fi done \
    && mkdir -p $tempDir/modules \
    && cp -v objs/*.so $tempDir/modules \
    \
    && echo 'load_module "modules/ngx_http_upload_module.so";' > $tempDir/modules/http_upload.conf \
    && echo 'load_module "modules/ngx_http_uploadprogress_module.so";' > $tempDir/modules/http_uploadprogress.conf \
    && echo 'load_module "modules/ngx_http_redis2_module.so";' > $tempDir/modules/http_redis2.conf \
    \
    && cp -v $tempDir/modules/* /usr/lib/nginx/modules/

# Фаза настройки NGINX с нашими собранными модулями
FROM nginx:alpine

COPY --from=builder /usr/local/src/modules/* /usr/lib/nginx/modules/

# RUN set -x \
    # && apk add \
        # nginx-mod-http-upload-progress 
        # nginx-mod-http-redis2 

# SETUP NGINX CONFIGURATION FOR MODULES
# add to nginx.conf
# load_module modules/ngx_http_upload_module.so;
RUN set -x \
    && apk add sed \
    && sed -i '1i \
    include /etc/nginx/modules/*.conf;\n \
    \n'  /etc/nginx/nginx.conf 
    
# ACTIVATE ADDITIONAL INSTALLED MODULES
RUN set -x \
    && echo 'load_module "modules/ngx_http_image_filter_module.so";' > /etc/nginx/modules/http_image_filter.conf \
    && echo 'load_module "modules/ngx_http_js_module.so";' > /etc/nginx/modules/http_js.conf \
    && echo 'load_module "modules/ngx_stream_js_module.so";' > /etc/nginx/modules/stream_js.conf    

