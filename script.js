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

// Default usernames
const username = "Anhhh"; // Your default name
let newMessageCount = 0; // Counter for new messages

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
    const message = messageInput.value.trim(); // Trim whitespace
    if (message) {
        const convertedMessage = convertEmoticonsToEmoji(message);
        const messageRef = db.ref('messages').push();
        messageRef.set({
            message: convertedMessage,
            timestamp: Date.now(),
            senderName: username,
            isSender: true
        });
        messageInput.value = ''; // Clear input after sending
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
    const senderElement = document.createElement('strong');
    senderElement.textContent = msgData.senderName + ': ';
    msgElement.appendChild(senderElement);

    const messageContent = document.createElement('span');
    messageContent.textContent = msgData.message;
    msgElement.appendChild(messageContent);

    if (msgData.senderName === username) {
        msgElement.classList.add('my-message');
    } else {
        msgElement.classList.add('other-message');
        newMessageCount++;
        updateTitle();
    }

    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Update the page title with the new message count
function updateTitle() {
    document.title = `(${newMessageCount}) emlacuatoi`;
}

// Clear all messages when 'Clear All' button is clicked
clearAllButton.addEventListener('click', () => {
    db.ref('messages').remove()
      .then(() => {
          chatBox.innerHTML = '';
          newMessageCount = 0;
          document.title = "emlacuatoi";
      })
      .catch((error) => {
          console.error("Error deleting messages:", error);
      });
});

// Listen for message removal
db.ref('messages').on('child_removed', function(snapshot) {
    const messageId = snapshot.key;
    const msgElements = chatBox.querySelectorAll('div[data-id]');

    msgElements.forEach((msgElement) => {
        if (msgElement.getAttribute('data-id') === messageId) {
            msgElement.remove();
        }
    });
});
