const socket = io('/');
const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '9008',
});

let myVideoStream;
const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    // answer call from other user joining the room
    myPeer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on('user-connected', (userId) => {
      setTimeout(() => {
        connectToNewUser(userId, stream);
      }, 1000);
    });
  });

myPeer.on('open', (id) => {
  // console.log(id);
  socket.emit('join-room', ROOM_ID, id);
});

// on => 'user-connected'
const connectToNewUser = (userId, stream) => {
  // console.log('new user', userId);
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
};
