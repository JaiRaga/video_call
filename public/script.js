const socket = io('/');
const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '9008',
});

let myVideoStream;
const myVideo = document.createElement('video');
// myVideo.muted = true;
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

    let text = $('input');

    $('html').keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit('message', text.val());
        text.val('');
      }
    });

    socket.on('createMessage', (message) => {
      // Append the message to the unordered list
      $('ul').append(`<li class="message"><b>Anon</b><br/>${message}</li>`);
      scrollToBottom();
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

// let text = $('input');

// $('html').keydown((e) => {
//   if (e.which == 13 && text.val().length !== 0) {
//     socket.emit('message', text.val());
//     text.val('');
//   }
// });

// socket.on('createMessage', (message) => {
//   // Append the message to the unordered list
//   $('ul').append(`<li class="message"><b>Anon</b><br/>${message}</li>`);
//   scrollToBottom();
// });

// Make sure the chat messages doesn't flow outside the chat container
const scrollToBottom = () => {
  let d = $('.main__chat_window');
  d.scrollTop(d.prop('scrollHeight'));
};

// mute our video
const muteUnmuteVideo = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
    <i class="fa-solid fa-microphone"></i>
    <span>Mute</span>
  `;
  document.querySelector('.main__mute_button').innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fa-solid fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector('.main__mute_button').innerHTML = html;
};

// Play/Stop the video stream
const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () => {
  const html = `
    <i class="fa-solid fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fa-solid fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}