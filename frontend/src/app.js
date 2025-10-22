const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const imageForm = document.getElementById('imageForm');

// Preview selected image
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
});

// Function to send data to API Gateway
async function sendData(filename, content) {
    const data = { filename: filename, content: content };
    const response = await fetch('https://t1oshk7xhi.execute-api.ap-south-1.amazonaws.com/Dev/upload', {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: base64Data
    });
    const result = await response.json();
    console.log(result);
    alert(result.message); // Optional: show message to user
}

// Handle form submission
imageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = imageInput.files[0];
    if(!file) return alert('Please select an image first.');

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64Data = event.target.result.split(',')[1]; // Remove data:image/...;base64,
        sendData(file.name, base64Data); // Send to API Gateway
    }
    reader.readAsDataURL(file);
});
