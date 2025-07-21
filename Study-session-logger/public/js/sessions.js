function deleteSession(id) {
    if (confirm('Are you sure you want to delete this study session?')) {
        fetch(`/session/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                alert('Failed to delete session');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete session');
        });
    }
}

function completeSession(id) {
    fetch(`/session/${id}/complete`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            alert('Failed to complete session');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to complete session');
    });
} 