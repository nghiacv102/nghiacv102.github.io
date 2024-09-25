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

// Function to get or set username
function getUsername() {
    let username = localStorage.getItem('username');
    if (!username) {
        username = prompt("Please enter your name:"); // Prompts user to enter their name
        if (username) { // Check if user entered something
            localStorage.setItem('username', username); // Save the username in localStorage
        } else {
            username = "Anonymous"; // Fallback if user doesn't enter anything
        }
    }
    return username;
}

const username = getUsername(); // Get username from localStorage or prompt if not set

// Request notification permission
function requestNotificationPermission() {
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Notify user of new message
function notifyUser(message) {
    if (Notification.permission === 'granted') {
        const notification = new Notification("New message", {
            body: message,
            icon: "path/to/icon.png" // Optional: Path to an icon
        });
    }
}

requestNotificationPermission(); // Request permission for notifications

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

    // Replace text emoticons with corresponding emoji
    return message.replace(/:\w+|<3|;\)|B-\)|O:\)|XD|>\:\)|:\(/g, function(match) {
        return emoticonsMap[match] || match;
    });
}

// Function to send message
function sendMessage() {
    const message = messageInput.value;
    if (message) {
        const convertedMessage = convertEmoticonsToEmoji(message); // Convert text to emoji
        const messageRef = db.ref('messages').push();
        messageRef.set({
            message: convertedMessage,
            timestamp: Date.now(),
            senderName: username, // Add sender's name
            isSender: true // Flag to indicate who sent the message
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
    const senderElement = document.createElement('strong'); // Sender's name
    senderElement.textContent = msgData.senderName + ': ';
    msgElement.appendChild(senderElement);

    const messageContent = document.createElement('span');
    messageContent.textContent = msgData.message;
    msgElement.appendChild(messageContent);

    // Set different style for sender and receiver
    if (msgData.senderName === username) {
        msgElement.classList.add('my-message'); // Message from the current user
    } else {
        msgElement.classList.add('other-message'); // Message from others
        notifyUser(msgData.message); // Notify if the message is from another user
    }

    // Append message to chat box
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
});

// Clear all messages when 'Clear All' button is clicked
clearAllButton.addEventListener('click', () => {
    db.ref('messages').remove() // Remove all messages from Firebase
      .then(() => {
          chatBox.innerHTML = ''; // Clear chat box in UI after successful deletion
      })
      .catch((error) => {
          console.error("Error deleting messages:", error);
      });
});

// Listen for message removal
db.ref('messages').on('child_removed', function(snapshot) {
    const messageId = snapshot.key; // Get the key of the deleted message
    const msgElements = chatBox.querySelectorAll('div[data-id]');

    msgElements.forEach((msgElement) => {
        if (msgElement.getAttribute('data-id') === messageId) {
            msgElement.remove(); // Remove the message from the UI
        }
    });
});
