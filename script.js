document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const clearChatButton = document.getElementById('clear-chat-button');

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    clearChatButton.addEventListener('click', function() {
        chatBox.innerHTML = '';
    });

    async function sendMessage() {
        const userMessage = userInput.value.trim();

        if (userMessage) {
            addMessage('user', userMessage);
            userInput.value = '';
            showTypingIndicator();

            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'user-id': '1' // Hardcoded user ID
                };

                const response = await fetch('https://testn8n-sttg.onrender.com/webhook/message', {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({ message: userMessage }),
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const result = await response.json();
                console.log("API Response:", result);

                removeTypingIndicator();

                if (result && result.output) {
                    addMessage('bot', result.output);
                } else {
                    addMessage('bot', "No reply from chatbot.");
                }
            } catch (err) {
                console.error("Error sending message:", err);
                removeTypingIndicator();
                addMessage('bot', "⚠️ Error: Could not get a response from the bot.");
            }
        }
    }

    function showTypingIndicator() {
        // Placeholder for typing indicator
        // You might add a message like "Bot is typing..." or an animation
        console.log("Bot is typing...");
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.classList.add('flex', 'items-center', 'mb-4', 'text-gray-500');
        typingIndicator.innerHTML = `
            <img src="dp.jpeg" class="w-8 h-8 rounded-full mr-2">
            <span>Typing...</span>
        `;
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        console.log("Bot stopped typing.");
    }

    function addMessage(sender, message) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('flex', 'items-end', 'mb-4'); // Common wrapper for message and avatar

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('px-4', 'py-2', 'rounded-2xl', 'max-w-full', 'break-words', 'message-bubble'); // Common bubble styling

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Process message for bold text
        const processedMessage = message.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

        const messageContent = document.createElement('div');
        messageContent.innerHTML = processedMessage; // Use innerHTML to render bold tags

        const timestampElement = document.createElement('span');
        timestampElement.classList.add('text-xs', 'opacity-75', 'mt-1', 'block');
        timestampElement.textContent = timestamp;

        if (sender === 'user') {
            messageWrapper.classList.add('justify-end'); // Align to right for user
            messageBubble.classList.add('bg-blue-500', 'text-white', 'rounded-br-none'); // User bubble style
            messageBubble.appendChild(messageContent);
            messageBubble.appendChild(timestampElement);
            messageWrapper.appendChild(messageBubble);
        } else {
            const avatar = document.createElement('img');
            avatar.src = 'dp.jpeg'; // Riya's avatar
            avatar.classList.add('w-8', 'h-8', 'rounded-full', 'mr-2'); // Avatar styling
            messageWrapper.appendChild(avatar);

            messageBubble.classList.add('bg-pink-200', 'text-gray-800', 'rounded-bl-none', 'message-pop'); // Bot bubble style
            messageBubble.appendChild(messageContent);
            messageBubble.appendChild(timestampElement);
            messageWrapper.appendChild(messageBubble);
        }

        chatBox.appendChild(messageWrapper);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
