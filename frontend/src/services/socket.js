import { io } from 'socket.io-client';
import config from '../config/config';

const socket = io(config.socketUrl, {
  transports: ['websocket'],
});

export default socket;
