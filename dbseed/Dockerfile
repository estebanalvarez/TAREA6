FROM mongo

COPY init.json /init.json

CMD mongoimport --host mongo --db usuarios --collection usuarios --type json --file /init.json --jsonArray