import io from 'socket.io-client';
import {settings} from '../../app/config';
import {_requestServerLogs} from './teacher-socket';

let socket;

export const inittiateSocket = (room, user, info = 'Not known', status = 1) => {
  socket = io(settings.NodeJsServer, {autoConnect: false});
  if (!socket.connected) {
    socket.connect();
    console.log(`Connecting socket . . . `);
    if (socket && room) {
      console.log(`. . . joining room ${room}`);
      socket.emit('client-request-join', {
        user: user,
        room: room,
        info: info,
        status: status,
      });
    } else {
      console.log(`Failed when join room ${room}`);
    }
  } else {
    console.log(`User connected, dont reconect . . . `);
  }
};

export const disconnectSocket = () => {
  console.log(`Disconnecting socket . . . `);
  if (socket) socket.disconnect();
};

export const requestServerLogs = () => {
  _requestServerLogs();

  if (socket) socket.emit('client-request-logroom');
};

// ==================================== teacher ===============================================

// Student report when start
export const listenStudentInOut = sio => {
  if (!socket) return true;
  socket.on('server-send-newstatus', data => {
    console.log(`Socket nhan duoc cai nay: `, data);
    return sio(null, data);
  });
};

export const requestStartTest = (userID, room, isStart) => {
  if (!socket) return;
  console.log(`teacher-start-test  ${userID}  to room: ${room}`);
  socket.emit('teacher-start-test', {
    userID: userID,
    room: room,
    isStart: isStart,
  });
};
// ==================================== student ===============================================

export const serverStartTest = tt => {
  if (!socket) return;
  console.log(`Server start test`);
  socket.on('server-start-test', data => {
    console.log('That la qua mac hahahahahah: ', data);
    return tt(null, data);
  });
};

// ==================================== Demos ===============================================

export const subscribeToChat = cb => {
  if (!socket) return true;
  socket.on('chat', msg => {
    console.log('Websocket event received!');
    return cb(null, msg);
  });
};

export const reconectSocketAuto = rc => {
  if (!socket) return true;
  socket.on('connect', function () {
    console.log(` . . . auto reconect`);
    return rc(null, 'No ket noi lai kia`');
  });
};

export const sendMessage = (room, message) => {
  if (socket) socket.emit('chat', {message, room});
};
