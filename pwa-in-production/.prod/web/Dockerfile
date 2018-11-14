FROM nginx:1.15.5-alpine

ENV PORT 80

RUN apk update && \
    apk upgrade && \
    apk add --no-cache --virtual .build-deps \
    g++ gcc make python git && \
    apk add bash iputils vim curl nodejs nodejs-npm && \
    rm -rf /var/cache/apk/* && \
    rm -rf /tmp/* /var/tmp/*

RUN npm install -g yarn pm2

WORKDIR /usr/src/app

COPY . .

RUN cd /usr/src/app/client && \
    yarn install --production=false --force && \
    yarn build && \
    rm -rf ^build

RUN cd /usr/src/app/server && \
    yarn install --production=false --force

RUN apk del .build-deps

COPY .prod/web/ecosystem.config.js /usr/src/app/server/ecosystem.config.js

COPY .prod/web/nginx.conf /etc/nginx/nginx.conf

COPY .prod/web/*.sh /scripts/

RUN chmod a+x /scripts/*.sh

EXPOSE 80 443

ENTRYPOINT ["sh", "/scripts/entrypoint.sh"]

CMD ["sh", "/scripts/command.sh"]
