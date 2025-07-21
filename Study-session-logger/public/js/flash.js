// Auto-hide flash messages after 5 seconds
setTimeout(() => {
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        message.style.opacity = '0';
        message.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            message.remove();
        }, 500);
    });
}, 5000); 