import io from "socket.io-client";
export const getSocket = (name, roomId, address) => {
  return io(address, {
    query: `name=${name}&roomId=${roomId}`,
    reconnection: false,
  });
};
