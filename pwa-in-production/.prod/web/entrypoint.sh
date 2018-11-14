#!/bin/sh

set -x

cd /usr/src/app/server && yarn knex migrate:latest --env production

pm2 start /usr/src/app/server/ecosystem.config.js

$@
