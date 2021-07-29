export const _requestServerLogs = socket => {
  if (socket) socket.emit('client-request-logroom');
};
