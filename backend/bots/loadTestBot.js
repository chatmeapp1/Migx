const { io } = require('socket.io-client');

// Konfigurasi
const API_BASE_URL = process.env.API_BASE_URL || 'https://d1a7ddfc-5415-44f9-92c0-a278e94f8f08-00-1i8qhqy6zm7hx.sisko.replit.dev';
const ROOM_ID = 386; // ID room target untuk tes (Indonesia)
const JOIN_DELAY = 2000; // Jeda antar bot masuk (2 detik)
const MSG_DELAY_MIN = 5000; // Jeda pesan minimal (5 detik)
const MSG_DELAY_MAX = 15000; // Jeda pesan maksimal (15 detik)

// Daftar nama bot sesuai permintaan
const botNames = [
  "damayanti",
  "ningsih",
  "triangle",
  "mama_user",
  "srikandi",
  "purnama",
  "mentari",
  "lestari",
  "bintang",
  "pelangi"
];

const botMessages = [
  "Halo semuanya!",
  "Tes koneksi bot",
  "MIG33 Classic mantap",
  "Lagi apa nih?",
  "Cek speed server...",
  "Hadir gan",
  "Server aman?",
  "Room rame ya",
  "Salam kenal",
  "Wuih cepet juga responnya"
];

async function runLoadTest() {
  console.log(`🚀 Memulai Load Test dengan ${botNames.length} bot...`);
  
  for (let i = 0; i < botNames.length; i++) {
    const username = botNames[i];
    
    console.log(`[Bot ${i+1}] Menghubungkan sebagai ${username}...`);
    
    // Langsung hubungkan via socket
    const socket = io(`${API_BASE_URL}/chat`, {
      transports: ['websocket'],
      query: { username }
    });

    socket.on('connect', () => {
      console.log(`[Bot ${i+1}] ${username} Terhubung!`);
      // Emit join room langsung
      socket.emit('room:join', { roomId: ROOM_ID, username });
    });

    socket.on('room:joined', (data) => {
      console.log(`[Bot ${i+1}] ${username} Berhasil masuk ke room: ${data.roomName}`);
      startMessaging(socket, i + 1, username);
    });

    socket.on('chat:message', (msg) => {
      // Monitor bot pertama saja
      if (i === 0) {
        console.log(`[${username}] Pesan masuk: ${msg.username}: ${msg.text}`);
      }
    });

    socket.on('connect_error', (err) => {
      console.error(`[Bot ${i+1}] ${username} Koneksi Gagal:`, err.message);
    });

    // Jeda antar bot masuk
    await new Promise(resolve => setTimeout(resolve, JOIN_DELAY));
  }
}

function startMessaging(socket, botIndex, username) {
  const sendNext = () => {
    const delay = Math.floor(Math.random() * (MSG_DELAY_MAX - MSG_DELAY_MIN)) + MSG_DELAY_MIN;
    
    setTimeout(() => {
      const text = botMessages[Math.floor(Math.random() * botMessages.length)];
      socket.emit('chat:message', {
        roomId: ROOM_ID,
        username: username,
        text: `[LoadTest] ${text}`
      });
      
      console.log(`[Bot ${botIndex}] ${username} mengirim: ${text}`);
      sendNext();
    }, delay);
  };
  
  sendNext();
}

runLoadTest();
