let socket: WebSocket | null = null;

export function getWebSocket(): WebSocket {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    const isProduction = process.env.NODE_ENV === 'production';
    const ws_protocol = isProduction ? 'wss://' : 'ws://';
    const ws_host = isProduction ? 'themagi.systems' : 'localhost:8000';
    //PROD
    const ws_uri = `wss://themagi.systems/ws`;

    //DEV
    // const ws_uri = `ws://localhost:8000/ws`

    socket = new WebSocket(ws_uri);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      socket = null;
    };
  }

  return socket;
}

export function closeWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}