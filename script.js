
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
