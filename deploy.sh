#!/bin/bash

set -e

echo "Starting Study-mate deployment..."
cd /root/study-mate-server

npm install --production
mysql -u studymate -p'studymate123@' study_mate < sql/init.sql
pm2 restart study-mate || pm2 start app.js --name study-mate
pm2 save

echo "Study-mate deployment complete."
