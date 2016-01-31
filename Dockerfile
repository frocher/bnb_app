FROM nginx

RUN \
apt-get update && \
apt-get install -y curl && \
curl --silent --location https://deb.nodesource.com/setup_4.x | bash - && \
apt-get install -y \
nodejs \
npm install -g browsertime && npm cache clean && \
apt-get clean autoclean && \
rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN npm install -g bower
RUN npm install --production
RUN bower install

COPY dist /usr/share/nginx/html
