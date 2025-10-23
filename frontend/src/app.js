// app.js

const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const imageForm = document.getElementById('imageForm');
const responseBox = document.getElementById('responseBox'); // For showing CloudFront response

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

// 2️⃣ Function to send data to API Gateway (uploads to S3 via Lambda)
async function sendData(filename, base64Content) {
    const data = { filename: filename, content: base64Content };

    try {
        const response = await fetch('https://t1oshk7xhi.execute-api.ap-south-1.amazonaws.com/Dev/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Lambda/API Response:', result);

        alert(result.message || 'Image uploaded successfully! ✅');

        // 3️⃣ Fetch processed info from CloudFront
        // (Assuming CloudFront serves AI/metadata results from S3)
        if (result.filename) {
            await fetchCloudfrontData(result.filename);
        } else {
            responseBox.innerText = 'Image uploaded, but no metadata available yet.';
        }

    } catch (err) {
        console.error('Error uploading image:', err);
        alert('Failed to upload image. Check console for details.');
    }
}

// 4️⃣ Fetch processed AI metadata or recognition info from CloudFront
async function fetchCloudfrontData(filename) {
    try {
        // Example: CloudFront serves files from your S3 bucket (AI results)
        // Replace with your actual CloudFront URL:
        const cloudfrontURL = `https://d123456abcdef.cloudfront.net/processed/${filename}.json`;

        const res = await fetch(cloudfrontURL);
        if (!res.ok) throw new Error('Failed to fetch CloudFront data');

        const data = await res.json();
        console.log('CloudFront Response:', data);

        // Display metadata nicely
        responseBox.innerHTML = `
            <h3>AI Recognition Result:</h3>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        `;
    } catch (err) {
        console.error('Error fetching CloudFront data:', err);
        responseBox.innerHTML = `<p style="color:red;">Failed to load AI response. Try again later.</p>`;
    }
}

// 5️⃣ Handle form submission
imageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const file = imageInput.files[0];
    if (!file) return alert('Please select an image first.');

    const reader = new FileReader();
    reader.onload = function (event) {
        const base64Data = event.target.result.split(',')[1];
        sendData(file.name, base64Data);
    };
    reader.readAsDataURL(file);
});
