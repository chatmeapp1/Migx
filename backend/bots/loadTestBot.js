const { io } = require('socket.io-client');
const axios = require('axios');

// Konfigurasi
const API_BASE_URL = process.env.API_BASE_URL || 'https://d1a7ddfc-5415-44f9-92c0-a278e94f8f08-00-1i8qhqy6zm7hx.sisko.replit.dev';
const NUM_BOTS = 10;
const ROOM_ID = 386; // ID room target untuk tes (Indonesia)
const JOIN_DELAY = 2000; // Jeda antar bot masuk (2 detik)
const MSG_DELAY_MIN = 5000; // Jeda pesan minimal (5 detik)
const MSG_DELAY_MAX = 15000; // Jeda pesan maksimal (15 detik)

const botMessages = [
  "Halo semuanya!",
  "Tes koneksi bot",
  "MIG33 Classic mantap",
  "Lagi apa nih?",
  "Cek speed server...",
  "Bot 101 hadir",
  "Server aman?",
  "Room rame ya",
  "Salam kenal",
  "Wuih cepet juga responnya"
];

async function runLoadTest() {
  console.log(`🚀 Memulai Load Test dengan ${NUM_BOTS} bot...`);
  
  for (let i = 1; i <= NUM_BOTS; i++) {
    const username = `BotUser_${i}_${Math.floor(Math.random() * 1000)}`;
    const password = 'password123';
    
    try {
      // 1. Register/Login Bot (Kita asumsikan login sukses atau register otomatis jika belum ada)
      // Untuk kemudahan tes, kita langsung pakai socket dengan username dummy
      // Jika sistem butuh token, bot harus login dulu
      
      console.log(`[Bot ${i}] Menghubungkan sebagai ${username}...`);
      
      const socket = io(`${API_BASE_URL}/chat`, {
        transports: ['websocket'],
        query: { username }
      });

      socket.on('connect', () => {
        console.log(`[Bot ${i}] Terhubung!`);
        
        // 2. Masuk ke Room
        socket.emit('room:join', { roomId: ROOM_ID, username });
      });

      socket.on('room:joined', (data) => {
        console.log(`[Bot ${i}] Berhasil masuk ke room: ${data.roomName}`);
        
        // 3. Mulai kirim pesan dengan jeda random
        startMessaging(socket, i, username);
      });

      socket.on('chat:message', (msg) => {
        // Log pesan masuk hanya untuk bot pertama agar tidak spam console
        if (i === 1) {
          console.log(`[Bot 1] Menerima pesan: ${msg.username}: ${msg.text}`);
        }
      });

      socket.on('error', (err) => {
        console.error(`[Bot ${i}] Error:`, err);
      });

      // Jeda sebelum bot berikutnya masuk
      await new Promise(resolve => setTimeout(resolve, JOIN_DELAY));
      
    } catch (error) {
      console.error(`[Bot ${i}] Gagal inisialisasi:`, error.message);
    }
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
      
      console.log(`[Bot ${botIndex}] Mengirim pesan: ${text}`);
      sendNext();
    }, delay);
  };
  
  sendNext();
}

runLoadTest();
