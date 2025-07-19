// Menunggu DOM sepenuhnya dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {
    // Mendapatkan referensi elemen-elemen DOM
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatList = document.querySelector('.chat-list');
    const currentChatHeaderName = document.querySelector('.main-chat .chat-header h4');
    const currentChatHeaderStatus = document.querySelector('.main-chat .chat-header p');
    const currentChatHeaderImg = document.querySelector('.main-chat .chat-header img');

    // Data dummy untuk simulasi chat
    // Dalam aplikasi nyata, data ini akan diambil dari backend/database
    const chats = {
        1: {
            name: "John Doe",
            status: "Online",
            avatar: "https://via.placeholder.com/50/FF5733/FFFFFF?text=JD",
            messages: [
                { text: "Hai, apa kabar?", type: "received", timestamp: "10:28 AM" },
                { text: "Baik, kamu?", type: "sent", timestamp: "10:29 AM" },
                { text: "Lagi sibuk apa hari ini?", type: "received", timestamp: "10:30 AM" }
            ]
        },
        2: {
            name: "Jane Smith",
            status: "Offline",
            avatar: "https://via.placeholder.com/50/33FF57/FFFFFF?text=JS",
            messages: [
                { text: "Halo!", type: "sent", timestamp: "Kemarin 09:00 AM" },
                { text: "Oke, sampai nanti!", type: "received", timestamp: "Kemarin 09:15 AM" }
            ]
        }
    };

    let activeChatId = '1'; // Menetapkan chat pertama sebagai chat aktif default

    // Fungsi untuk memuat dan menampilkan pesan ke area chat
    function loadMessages(chatId) {
        chatMessages.innerHTML = ''; // Bersihkan pesan yang ada sebelumnya
        const currentChat = chats[chatId]; // Dapatkan data chat yang aktif

        // Perbarui header chat dengan info kontak yang aktif
        currentChatHeaderName.textContent = currentChat.name;
        currentChatHeaderStatus.textContent = currentChat.status;
        currentChatHeaderImg.src = currentChat.avatar;

        // Iterasi melalui pesan dan tambahkan ke DOM
        currentChat.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', msg.type); // Tambahkan kelas 'message' dan 'sent'/'received'
            messageDiv.innerHTML = `<p>${msg.text}</p><span class="msg-timestamp">${msg.timestamp}</span>`;
            chatMessages.appendChild(messageDiv); // Tambahkan pesan ke area chat
        });
        // Gulir ke bawah agar pesan terbaru selalu terlihat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Event listener untuk tombol kirim pesan
    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim(); // Ambil teks dari input dan hapus spasi kosong di awal/akhir
        if (messageText) { // Pastikan pesan tidak kosong
            const now = new Date();
            // Format waktu menjadi HH:MM AM/PM
            const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Buat objek pesan baru
            const message = { text: messageText, type: "sent", timestamp: timestamp };
            // Tambahkan pesan ke data dummy chat yang aktif
            chats[activeChatId].messages.push(message);

            // Buat elemen DOM untuk pesan yang baru dikirim
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'sent');
            messageDiv.innerHTML = `<p>${messageText}</p><span class="msg-timestamp">${timestamp}</span>`;
            chatMessages.appendChild(messageDiv); // Tambahkan pesan ke area chat

            messageInput.value = ''; // Kosongkan input pesan
            chatMessages.scrollTop = chatMessages.scrollHeight; // Gulir ke bawah
        }
    });

    // Event listener untuk mengirim pesan dengan tombol Enter
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { // Jika tombol yang ditekan adalah Enter
            sendButton.click(); // Picu klik pada tombol kirim
        }
    });

    // Event listener untuk mengganti chat aktif saat item chat di sidebar diklik
    chatList.addEventListener('click', (e) => {
        // Temukan elemen chat-item terdekat yang diklik
        const chatItem = e.target.closest('.chat-item');
        if (chatItem) {
            // Hapus kelas 'active' dari chat yang sebelumnya aktif
            const currentActive = document.querySelector('.chat-item.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }

            // Tambahkan kelas 'active' ke chat yang baru diklik
            chatItem.classList.add('active');
            // Perbarui ID chat aktif
            activeChatId = chatItem.dataset.chatId;
            // Muat pesan untuk chat yang baru aktif
            loadMessages(activeChatId);
        }
    });

    // Inisialisasi: Muat chat pertama kali saat aplikasi dimuat
    loadMessages(activeChatId);
});
