#!/bin/bash

_grafana_tag=$1
_grafana_version=${_grafana_tag:1}

if [ "$_grafana_version" != "" ]; then
	echo "pushing danielkalen/grafana:${_grafana_version}"
	docker push danielkalen/grafana:${_grafana_version}
	docker push danielkalen/grafana:latest
else
	echo "pushing danielkalen/grafana:master"
	docker push danielkalen/grafana:master
fi