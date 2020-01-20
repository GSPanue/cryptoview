const createWebSocket = () => (
  new WebSocket(process.env.api)
);

export {
  createWebSocket
}
