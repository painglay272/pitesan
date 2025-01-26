// Fetch and Display Points
function updatePoints(points) {
    document.getElementById('total-points').textContent = points;
    document.getElementById('today-income').textContent = points;
}

// Navigation Function
function navigateTo(screen) {
    document.querySelectorAll('#app > div').forEach(div => div.style.display = 'none');
    document.getElementById(screen).style.display = 'block';
}

// Earn Points via Ads
document.getElementById('earn-point-btn').addEventListener('click', () => {
    show_8852990().then(() => {
        alert('You have earned 10 points!');
        updatePoints(10);
    });
});

// Generate Invite Link
document.getElementById('generate-invite-link-btn').addEventListener('click', async () => {
    const response = await fetch('/api/invite/generate');
    const data = await response.json();
    if (data.success) {
        document.getElementById('invite-link-container').textContent = data.link;
    } else {
        alert('Failed to generate invite link!');
    }
});

// Withdraw Points
document.getElementById('withdraw-btn').addEventListener('click', async () => {
    const amount = parseInt(document.getElementById('withdraw-amount').value);
    const method = document.getElementById('payment-method').value;
    const account = document.getElementById('account-number').value;

    const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method, account })
    });

    const data = await response.json();
    if (data.success) {
        document.getElementById('withdraw-message').textContent = 'Withdraw successful!';
        updatePoints(data.points);
    } else {
        alert(data.error);
    }
});