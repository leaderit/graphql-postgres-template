# ALPINE

## Узнать установленные модули:
    nginx -V 2>&1|xargs -n1|grep module

## Узнать что еще можно установить

    bash-5.0# apk search nginx-mod

### Пример вывода

    nginx-mod-http-geoip2-1.18.0-r1
    nginx-mod-http-dav-ext-1.18.0-r1
    nginx-mod-mail-1.18.0-r1
    nginx-mod-http-lua-upstream-1.18.0-r1
    nginx-mod-stream-js-1.18.0-r1
    nginx-mod-http-upload-progress-1.18.0-r1
    nginx-mod-http-lua-1.18.0-r1
    nginx-mod-rtmp-1.18.0-r1
    nginx-mod-http-echo-1.18.0-r1
    nginx-mod-http-set-misc-1.18.0-r1
    nginx-mod-http-image-filter-1.18.0-r1
    nginx-mod-http-nchan-1.18.0-r1
    nginx-mod-stream-geoip2-1.18.0-r1
    nginx-mod-http-shibboleth-1.18.0-r1
    nginx-mod-http-cache-purge-1.18.0-r1
    nginx-mod-http-fancyindex-1.18.0-r1
    nginx-mod-http-redis2-1.18.0-r1
    nginx-mod-http-geoip-1.18.0-r1
    nginx-mod-http-headers-more-1.18.0-r1
    nginx-mod-stream-1.18.0-r1
    nginx-mod-http-xslt-filter-1.18.0-r1
    nginx-mod-devel-kit-1.18.0-r1
    nginx-mod-http-perl-1.18.0-r1
    nginx-mod-http-js-1.18.0-r1
    nginx-mod-http-upstream-fair-1.18.0-r1
    nginx-mod-http-vod-1.18.0-r1
    nginx-mod-stream-geoip-1.18.0-r1