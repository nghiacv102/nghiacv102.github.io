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

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-btn');
const clearAllButton = document.getElementById('clear-all-btn');

let unreadCount = 0; // Số tin nhắn chưa đọc
let replyingTo = null; // Lưu tin nhắn đang trả lời

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

function sendMessage() {
    const message = messageInput.value;
    if (message) {
        const convertedMessage = convertEmoticonsToEmoji(message);
        const messageRef = db.ref('messages').push();
        messageRef.set({
            message: convertedMessage,
            timestamp: Date.now(),
            senderName: "Anhhh",
            isSender: true,
            replyTo: replyingTo // Thêm thông tin tin nhắn trả lời
        });
        messageInput.value = ''; // Clear input after sending
        replyingTo = null; // Reset reply after sending
    }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

db.ref('messages').on('child_added', function(snapshot) {
    const msgData = snapshot.val();
    const msgElement = document.createElement('div');
    const senderElement = document.createElement('strong');
    senderElement.textContent = msgData.senderName + ': ';
    msgElement.appendChild(senderElement);

    const messageContent = document.createElement('span');
    messageContent.textContent = msgData.message;
    msgElement.appendChild(messageContent);

    if (msgData.replyTo) {
        const replyElement = document.createElement('div');
        replyElement.style.marginLeft = '20px'; // Indent for replies
        replyElement.textContent = `Replying to: ${msgData.replyTo}`;
        msgElement.appendChild(replyElement);
    }

    if (msgData.senderName === "Anhhh") {
        msgElement.classList.add('my-message');
    } else {
        msgElement.classList.add('other-message');
        unreadCount++;
        document.title = `(${unreadCount}) emlacuatoi`;
    }

    msgElement.addEventListener('click', () => {
        replyingTo = msgData.message; // Ghi nhận tin nhắn đang trả lời
        messageInput.value = `@${msgData.senderName}: `; // Hiển thị thông báo trong input
    });

    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

clearAllButton.addEventListener('click', () => {
    db.ref('messages').remove()
      .then(() => {
          chatBox.innerHTML = '';
          unreadCount = 0;
          document.title = 'emlacuatoi';
      })
      .catch((error) => {
          console.error("Error deleting messages:", error);
      });

db.ref('messages').on('child_removed', function(snapshot) {
    const messageId = snapshot.key;
    const msgElements = chatBox.querySelectorAll('div[data-id]');

    msgElements.forEach((msgElement) => {
        if (msgElement.getAttribute('data-id') === messageId) {
            msgElement.remove();
        }
    });
});
