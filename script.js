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
    const msgElement = document.createElement('div');
    msgElement.textContent = msgData.message;

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
