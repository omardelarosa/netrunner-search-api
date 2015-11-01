
echo "[$(date)]: $(curl -XDELETE http://localhost:9200/netrunner)" >> $HOME/nrdb-imports.log
echo "[$(date)]: $($HOME/netrunner-search-api/node_modules/.bin/gulp importCards)" >> $HOME/nrdb-imports.log
