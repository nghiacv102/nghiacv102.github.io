// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyD-XCVoVKwP2d_Fxp5XbkgdFpr1Y-7qtMk",
    authDomain: "linhtinh-8f82a.firebaseapp.com",
    databaseURL: "https://linhtinh-8f82a-default-rtdb.firebaseio.com",
    projectId: "linhtinh-8f82a",
    storageBucket: "linhtinh-8f82a.appspot.com",
    messagingSenderId: "824846452214",
    appId: "1:824846452214:web:ae29580be329f285c973d7",
    measurementId: "G-STHKF3G1EZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Elements
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-btn');
const clearAllButton = document.getElementById('clear-all-btn');

// Get username
let username = prompt("Please enter your name:");

// Function to send message
function sendMessage() {
    const message = messageInput.value;
    if (message) {
        const messageRef = db.ref('messages').push();
        messageRef.set({
            message: message,
            timestamp: Date.now(),
            senderName: username
        });
        messageInput.value = '';
    }
}

// Listen for "Send" button click
sendButton.addEventListener('click', sendMessage);

// Listen for "Enter" key press
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Listen for new messages from Firebase
db.ref('messages').on('child_added', function(snapshot) {
    const msgData = snapshot.val();
    const msgElement = document.createElement('div');

    if (msgData.senderName === username) {
        msgElement.classList.add('my-message');
    } else {
        msgElement.classList.add('other-message');
    }

    const senderElement = document.createElement('strong');
    senderElement.textContent = msgData.senderName + ': ';
    msgElement.appendChild(senderElement);

    const messageContent = document.createElement('span');
    messageContent.textContent = msgData.message;
    msgElement.appendChild(messageContent);

    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Clear all messages when 'Clear All' button is clicked
clearAllButton.addEventListener('click', () => {
    db.ref('messages').remove()
        .then(() => {
            chatBox.innerHTML = '';
        })
        .catch((error) => {
            console.error("Error deleting messages:", error);
        });
});
let replyingTo = null; // Biến để lưu tin nhắn đang được trả lời

// Function to send message
function sendMessage() {
    const message = messageInput.value;
    if (message) {
        const messageRef = db.ref('messages').push();
        messageRef.set({
            message: message,
            timestamp: Date.now(),
            senderName: username,
            replyingTo: replyingTo // Thêm thông tin tin nhắn đang trả lời
        });
        messageInput.value = '';
        replyingTo = null; // Reset lại
    }
}

// Listen for new messages from Firebase
db.ref('messages').on('child_added', function(snapshot) {
    const msgData = snapshot.val();
    const msgElement = document.createElement('div');

    // Xử lý việc hiển thị tin nhắn đang được trả lời
    if (msgData.replyingTo) {
        const replyElement = document.createElement('div');
        replyElement.textContent = "Replying to: " + msgData.replyingTo;
        replyElement.classList.add('replying-to');
        msgElement.appendChild(replyElement);
    }

    if (msgData.senderName === username) {
        msgElement.classList.add('my-message');
    } else {
        msgElement.classList.add('other-message');
    }

    const senderElement = document.createElement('strong');
    senderElement.textContent = msgData.senderName + ': ';
    msgElement.appendChild(senderElement);

    const messageContent = document.createElement('span');
    messageContent.textContent = msgData.message;
    msgElement.appendChild(messageContent);

    // Thêm sự kiện click để trả lời tin nhắn
    msgElement.addEventListener('click', () => {
        replyingTo = msgData.message; // Lưu tin nhắn để trả lời
        messageInput.placeholder = "Replying to: " + msgData.message; // Cập nhật placeholder
    });

    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

