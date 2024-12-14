document.addEventListener('DOMContentLoaded', function() {
    fetch('http://192.168.129.160/data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('data').textContent = data.value;
        })
        .catch(error => console.error('Error:', error));
});
