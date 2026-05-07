SHELL := /bin/bash

ROOT_DIR    := $(CURDIR)
CLIENT_DIR  := $(ROOT_DIR)/client/client
SERVER_DIR  := $(ROOT_DIR)/server
SERVICE     := myjobs

.PHONY: help build pull install client-build server-install restart status logs

help:
	@echo "Available targets:"
	@echo "  make build           Pull, install, build client, and restart $(SERVICE)"
	@echo "  make pull            git pull in $(ROOT_DIR)"
	@echo "  make install         npm install in client and server"
	@echo "  make client-build    Build the React client (vite)"
	@echo "  make server-install  npm install in server"
	@echo "  make restart         sudo systemctl restart $(SERVICE)"
	@echo "  make status          sudo systemctl status $(SERVICE)"
	@echo "  make logs            sudo journalctl -u $(SERVICE) -f"

build: pull install client-build restart status

pull:
	@echo ">> git pull in $(ROOT_DIR)"
	cd "$(ROOT_DIR)" && git pull --ff-only

install: server-install
	@echo ">> npm install in $(CLIENT_DIR)"
	cd "$(CLIENT_DIR)" && npm install

server-install:
	@echo ">> npm install in $(SERVER_DIR)"
	cd "$(SERVER_DIR)" && npm install

client-build:
	@echo ">> npm run build in $(CLIENT_DIR)"
	cd "$(CLIENT_DIR)" && npm run build

restart:
	@echo ">> sudo systemctl restart $(SERVICE)"
	sudo systemctl restart $(SERVICE)

status:
	sudo systemctl status $(SERVICE) --no-pager

logs:
	sudo journalctl -u $(SERVICE) -f
