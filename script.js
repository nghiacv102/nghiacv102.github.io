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
const clearAllButton = document.getElementById('clear-all-btn'); // Nút xóa tất cả

// Send message to Firebase
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        const messageRef = db.ref('messages').push();
        messageRef.set({
            message: message,
            timestamp: Date.now()  // Thêm timestamp cho từng tin nhắn
        });
        messageInput.value = ''; // Clear input after sending
    }
});

// Listen for new messages from Firebase
db.ref('messages').on('child_added', function(snapshot) {
    const msgData = snapshot.val();
    const msgKey = snapshot.key;

    // Create message element
    const msgElement = document.createElement('div');
    msgElement.textContent = msgData.message;
    msgElement.dataset.key = msgKey;  // Set a data attribute with the message key

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Xóa";
    deleteButton.style.marginLeft = "10px"; // Add some space between the message and the button
    deleteButton.addEventListener('click', function() {
        // Delete message from Firebase
        db.ref('messages/' + msgKey).remove();
    });

    // Append message and delete button to chat box
    msgElement.appendChild(deleteButton);
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
});

// Listen for message removal from Firebase
db.ref('messages').on('child_removed', function(snapshot) {
    const msgKey = snapshot.key;

    // Find and remove the message from the chat box
    const messages = chatBox.childNodes;
    messages.forEach(function(msgElement) {
        if (msgElement.dataset.key === msgKey) {
            chatBox.removeChild(msgElement);
        }
    });
});

// Clear all messages when 'Clear All' button is clicked
clearAllButton.addEventListener('click', () => {
    // Remove all messages from Firebase
    db.ref('messages').remove();
});
