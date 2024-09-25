body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}

#chat-container {
    width: 400px; /* Đặt chiều rộng */
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    display: flex;
    flex-direction: column;
    height: 600px; /* Chiều cao chat box */
}

#chat-box {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.my-message {
    background-color: #add8e6; /* Màu xanh cho tin nhắn của bạn */
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
    align-self: flex-end; /* Tin nhắn của bạn nằm bên phải */
    max-width: 70%; /* Chiều rộng tối đa */
}

.other-message {
    background-color: #ffcccb; /* Màu hồng nhạt cho tin nhắn của đối phương */
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
    align-self: flex-start; /* Tin nhắn của đối phương nằm bên trái */
    max-width: 70%; /* Chiều rộng tối đa */
}

input[type="text"] {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-right: 10px;
}

button {
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
