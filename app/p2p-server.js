const Websocket = require('ws');

// P2P 서버가 어느 포트에 열릴지를 결정합니다.
// 기본적으로 환경 변수를 따라가며, 없을 경우 5001을 기본으로 합니다.
const P2P_PORT = process.env.P2P_PORT || 5001;

// Network에 참여하고 있는 Peer들을 보관합니다.
// 각 Peer들의 URL을 Array로 보관합니다. 주어지지 않았다면 빈 Array로 초기화합니다.
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

/**
 * P2P Server의 클래스입니다.
 */
class P2pServer {
  /**
   * P2P Server 클래스의 생성자입니다.
   * @param {blockchain} blockchain Blockchain 객체
   */
  constructor(blockchain) {
    this.blockchain = blockchain;

    // 등록된 Socket을 관리할 Array입니다.
    this.sockets = [];
  }

  /**
   * 서버를 시동합니다.
   */
  listen() {
    const server = new Websocket.Server({
      port: P2P_PORT
    });
    
    // 연결 이벤트에 대한 Listener입니다.
    server.on('connection', socket => this.connectSocket(socket));
    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
  }

  /**
   * 주어진 Socket을 서버에 등록합니다.
   * @param {WebSocket} socket 
   */
  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');
  }
}