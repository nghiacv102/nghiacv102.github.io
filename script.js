// Xoá Local Storage mỗi lần load trang
localStorage.removeItem('username'); // Xoá tên đã lưu

// Firebase config (Replace with your Firebase configuration details)
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
const db = firebase.database(); // Initialize Realtime Database

// Elements
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-btn');
const clearAllButton = document.getElementById('clear-all-btn');
const replyMessageDisplay = document.getElementById('reply-message'); // Phần tử hiển thị tin nhắn trả lời
const setNameButton = document.getElementById('set-name-btn');
const usernameInput = document.getElementById('username');
const nameInputSection = document.getElementById('name-input-section');

// Kiểm tra xem đã có tên trong Local Storage chưa
let username = localStorage.getItem('username');

// Nếu chưa có tên, yêu cầu người dùng nhập tên
if (!username) {
    nameInputSection.style.display = 'block'; // Hiển thị phần nhập tên

    // Lắng nghe sự kiện khi người dùng nhấn xác nhận tên
    setNameButton.addEventListener('click', function() {
        const inputName = usernameInput.value;

        // Kiểm tra nếu người dùng không nhập gì thì gán tên mặc định là 'anhiubeeee'
        if (!inputName) {
            username = 'anhiubeeee'; // Tên mặc định
        } else {
            username = inputName;
        }

        localStorage.setItem('username', username); // Lưu tên vào Local Storage
        alert(`Tên của bạn đã được đặt là: ${username}`);
        nameInputSection.style.display = 'none'; // Ẩn phần nhập tên sau khi người dùng xác nhận
    });
} else {
    // Nếu đã có tên trong Local Storage, ẩn phần nhập tên
    nameInputSection.style.display = 'none';
}
// Biến để lưu thông tin tin nhắn đang trả lời
let replyingTo = null;

// Emoji conversion function
function convertEmoticonsToEmoji(message) {
    const emoticonsMap = {
        ':v': '😂',
        ':D': '😃',
        ':P': '😜',
        ':)': '😊',
        ':(': '🙁',
        ':O': '😲',
        ":'(": '😢',
        '<3': '❤️',
        ';)': '😉',
        ':|': '😐',
        ':S': '😕',
        ':*': '😘',
        ':3': '😺',
        'B-)': '😎',
        'O:)': '😇',
        '>:)': '😠',
        ':x': '🤐',
        'XD': '😆'
    };

    return message.replace(/:\w+|<3|;\)|B-\)|O:\)|XD|>\:\)|:\(/g, function(match) {
        return emoticonsMap[match] || match;
    });
}

// Function to send message
function sendMessage() {
    const message = messageInput.value;
    if (message) {
        const convertedMessage = convertEmoticonsToEmoji(message);
        const messageRef = db.ref('messages').push();
        messageRef.set({
            message: convertedMessage,
            timestamp: Date.now(),
            senderName: username,
            replyingTo: replyingTo // Lưu thông tin tin nhắn đang trả lời
        });
        messageInput.value = ''; // Clear input after sending
        replyingTo = null; // Reset sau khi gửi
        replyMessageDisplay.textContent = ''; // Xóa tin nhắn trả lời hiển thị
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

    // Hiển thị tin nhắn trả lời nếu có
    if (msgData.replyingTo) {
        const replyInfo = document.createElement('div');
        replyInfo.textContent = `Replying to: ${msgData.replyingTo}`;
        replyInfo.style.fontStyle = 'italic';
        msgElement.appendChild(replyInfo);
    }

    // Set different styles for sender and receiver
    if (msgData.senderName === username) {
        msgElement.classList.add('my-message');
    } else {
        msgElement.classList.add('other-message');
        // Thêm sự kiện click để trả lời tin nhắn
        msgElement.addEventListener('click', () => {
            replyingTo = msgData.message; // Ghi nhận tin nhắn cần trả lời
            replyMessageDisplay.textContent = `Replying to: ${msgData.message}`;
        });
    }

    const senderElement = document.createElement('strong');
    senderElement.textContent = msgData.senderName + ': ';
    msgElement.appendChild(senderElement);

    const messageContent = document.createElement('span');
    messageContent.textContent = msgData.message;
    msgElement.appendChild(messageContent);

    // Append message to chat box
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
});

// Clear all messages when 'Clear All' button is clicked
clearAllButton.addEventListener('click', () => {
    db.ref('messages').remove()
      .then(() => {
          chatBox.innerHTML = ''; // Clear chat box in UI after successful deletion
      })
      .catch((error) => {
          console.error("Error deleting messages:", error);
      });
});
