import io from 'socket.io-client';
import { settings } from '../../app/config';
import { _requestServerLogs } from './teacher-socket';

let socket;

export const inittiateSocket = (room, user, info = 'Not known', status = 1) => {
    socket = io(settings.NodeJsServer, { autoConnect: false });
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
        console.log(`server-send-newstatus`);
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

// #1 emit
export const requestUpdateTestList = isRemove => {
    if (!socket) return;
    console.log('teacher-edit-test ', isRemove);
    socket.emit('teacher-edit-test', isRemove);
};

// ==================================== student ===============================================

export const serverStartTest = cbx => {
    if (!socket) return;
    console.log(`Server start test`);
    socket.on('server-start-test', data => {
        return cbx(null, data);
    });
};

// export const serverCancelTest = cb => {
//   if (!socket) return;
//   socket.on('server-cancel-test', data => {
//     console.log('server-cancel-test: ', data);
//     return cb(null, data);
//   });
// };

// #1 on
export const teacherEditTest = cb => {
    if (!socket) return;
    socket.on('server-edit-test', isRemove => {
        console.log('server-edit-test isRemove: ', isRemove);
        return cb(null, isRemove);
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
    if (socket) socket.emit('chat', { message, room });
};
