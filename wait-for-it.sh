#!/bin/sh

HOST="$1"
PORT="$2"
TIMEOUT="${3:-30}"

# Function to test TCP port connectivity
wait_for_tcp_port() {
  local host="$1"
  local port="$2"
  local timeout="$3"
  
  while ! nc -z "$host" "$port"; do
    timeout=$((timeout-1))
    if [ $timeout -le 0 ]; then
      echo "Timeout while waiting for $host:$port to be ready"
      exit 1
    fi
    echo "Waiting for $host:$port to be ready..."
    sleep 1
  done
}

# Check if host and port are provided
if [ -z "$HOST" ] || [ -z "$PORT" ]; then
  echo "Usage: $0 <host> <port> [timeout]"
  exit 1
fi


# Wait for TCP port to be ready
wait_for_tcp_port "$HOST" "$PORT" "$TIMEOUT"

echo "mysql is ready!"
