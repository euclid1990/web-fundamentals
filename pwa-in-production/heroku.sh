#!/bin/bash

docker build --file .prod/web/Dockerfile --tag pwa-in-production:latest .

docker tag pwa-in-production registry.heroku.com/pwa-in-production/web

docker push registry.heroku.com/pwa-in-production/web

heroku container:release web

docker run --rm --name pwa-in-production -it -p 80:80 -p 3000:3000 pwa-in-production
