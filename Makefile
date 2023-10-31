.PHONY: all
all: server


######################################################################

SHELL = /bin/bash
MAKEFLAGS += --no-print-directory

SERVER_ADDRESS = 127.127.127.127
SERVER_PORT    = 4320


######################################################################

.DEFAULT: all

# kill the server by performing a GET on /QUIT
# uses Linux commands: lsof, grep, cut
# server uses python (version 3)
.PHONY: server
server:
	( python ./build-tools/server.py $(SERVER_ADDRESS) $(SERVER_PORT) 2>&1 | tee >(grep -q -m1 '"GET /QUIT'; echo QUITTING; sleep 0.1; kill $$(lsof -itcp:$(SERVER_PORT) -sTCP:LISTEN -Fp | grep ^p | cut -c2-)) )

# uses curl
.PHONY: kill-server
kill-server:
	@if lsof -itcp:$(SERVER_PORT) -sTCP:LISTEN >/dev/null 2>&1; then echo 'sending QUIT to server'; curl -s http://$(SERVER_ADDRESS):$(SERVER_PORT)/QUIT >/dev/null 2>&1; fi

.PHONY: client
client:
	chromium --new-window http://$(SERVER_ADDRESS):$(SERVER_PORT)/src/index.html &
