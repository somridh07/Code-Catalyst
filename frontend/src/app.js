// Simple frontend logic for AI Tagging App

const app = document.getElementById("app");

// Basic HTML structure
app.innerHTML = `
  <h1>AI Media Tagging Portal</h1>
  <p>Upload an image or text file for AI analysis using AWS Rekognition & Comprehend.</p>
  
  <input type="file" id="fileInput" accept="image/*,text/plain" />
  <button id="uploadBtn">Upload</button>
  
  <div id="output"></div>
`;

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");

// TODO: Replace with your actual API Gateway endpoint URL
const API_URL = "https://YOUR_API_GATEWAY_ENDPOINT.amazonaws.com/prod/listings";

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file first.");
    return;
  }

  output.innerHTML = `<p>Uploading <b>${file.name}</b> for processing...</p>`;

  // Convert file to Base64 for sending to Lambda
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          content: reader.result.split(",")[1],
        }),
      });

      const data = await response.json();
      output.innerHTML = `
        <p><b>Upload Successful!</b></p>
        <p>Message: ${data.message}</p>
      `;
    } catch (error) {
      output.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
  };
  reader.readAsDataURL(file);
});
