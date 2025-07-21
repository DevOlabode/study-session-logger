// Check if we have sessions data to display
if (typeof subjects !== 'undefined' && typeof subjectData !== 'undefined') {
    // Prepare data for the chart
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

    // Create the chart
    const ctx = document.getElementById('subjectChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: subjects,
            datasets: [{
                data: subjectData,
                backgroundColor: colors.slice(0, subjects.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} min (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
} 