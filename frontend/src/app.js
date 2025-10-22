// app.js

const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const imageForm = document.getElementById('imageForm');

// 1️⃣ Preview selected image
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
});

// 2️⃣ Function to send data to API Gateway
async function sendData(filename, base64Content) {
    const data = { filename: filename, content: base64Content };

    try {
        const response = await fetch('https://t1oshk7xhi.execute-api.ap-south-1.amazonaws.com/Dev/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Must be JSON
            },
            body: JSON.stringify(data), // Send JSON
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        alert(result.message || 'Image uploaded successfully!');
    } catch (err) {
        console.error('Error uploading image:', err);
        alert('Failed to upload image. Check console for details.');
    }
}

// 3️⃣ Handle form submission
imageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const file = imageInput.files[0];
    if (!file) return alert('Please select an image first.');

    const reader = new FileReader();
    reader.onload = function (event) {
        const base64Data = event.target.result.split(',')[1]; // Remove data:image/...;base64,
        sendData(file.name, base64Data);
    };
    reader.readAsDataURL(file);
});

