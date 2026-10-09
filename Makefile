.PHONY: help dev dev-frontend dev-bridge install build

NPM ?= npm

help:
	@echo "TerraCortex Frontend Commands:"
	@echo " make dev-frontend : Run Next.js web application"
	@echo " make dev          : Alias for dev-frontend"
	@echo " make build        : Build Next.js production bundle"
	@echo " make dev-bridge   : Run MQTT Telemetry to Web Portal bridge"
	@echo " make install      : Install npm packages"

dev:
	$(NPM) run dev

dev-frontend: dev

dev-bridge:
	@echo ">> Starting MQTT Telemetry Bridge..."
	python3 -u mqtt_bridge.py


build:
	$(NPM) run build

install:
	$(NPM) install
