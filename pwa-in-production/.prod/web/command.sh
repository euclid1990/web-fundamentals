#!/bin/bash

envsubst '\$PORT' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf

/scripts/wait-for-it.sh 127.0.0.1:3000 --timeout=120 -- nginx -g 'daemon off;'
