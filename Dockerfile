FROM node:10.15.3

COPY ./src /app/src
COPY ./public /app/public
COPY ./manifest /app/manifest

COPY ./package.json /app/package.json
COPY ./jsconfig.json /app/jsconfig.json
COPY ./yarn.lock /app/yarn.lock
COPY ./.env /app/.env

WORKDIR /app

ARG plugin_version

RUN yarn install

RUN yarn global add web-ext

RUN TARGET_BROWSER=firefox yarn build
RUN web-ext build --source-dir=build/prod/ --overwrite-dest --artifacts-dir="artifacts/firefox";\
mv artifacts/firefox/*.zip artifacts/misakey-cookies${plugin_version}_firefox.zip; \
rm -rf artifacts/firefox; \
done

RUN TARGET_BROWSER=chrome yarn build
RUN web-ext build --source-dir=build/prod/ --overwrite-dest --artifacts-dir="artifacts/chrome"; \
mv artifacts/chrome/*.zip artifacts/misakey-cookies${plugin_version}_chrome.zip; \
rm -rf artifacts/chrome; \
done

RUN yarn global add serve

CMD ["serve"] 
