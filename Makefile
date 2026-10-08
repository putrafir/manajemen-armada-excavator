.PHONY: help dev dev-frontend install build

NPM ?= npm

help:
	@echo "TerraCortex Frontend Commands:"
	@echo " make dev-frontend : Run Next.js web application"
	@echo " make dev          : Alias for dev-frontend"
	@echo " make build        : Build Next.js production bundle"
	@echo " make install      : Install npm packages"

dev:
	$(NPM) run dev

dev-frontend: dev

build:
	$(NPM) run build

install:
	$(NPM) install
