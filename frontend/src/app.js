// app.js

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const imageForm = document.getElementById("imageForm");
const responseBox = document.getElementById("responseBox");

// 1️⃣ Preview selected image
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
});

// 2️⃣ Upload image to API Gateway → Lambda → S3 → DynamoDB
async function sendData(filename, base64Content) {
  const data = { filename: filename, content: base64Content };

  try {
    const response = await fetch(
      "https://t1oshk7xhi.execute-api.ap-south-1.amazonaws.com/Dev/upload",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Lambda/API Response:", result);

    alert(result.message || "Image uploaded successfully ✅");

    // 3️⃣ Wait for backend to process the image
    if (result.filename) {
      // Show temporary status
      responseBox.innerHTML =
        "<p><b>AI Recognition Response</b><br>Image uploaded, waiting for processing...</p>";

      // Try fetching the processed result every 5 seconds
      await pollForResult(result.filename);
    } else {
      responseBox.innerText =
        "Image uploaded, but no metadata available yet.";
    }
  } catch (err) {
    console.error("Error uploading image:", err);
    alert("Failed to upload image. Check console for details.");
  }
}

// 3️⃣ Poll CloudFront for processed metadata
async function pollForResult(filename) {
  const cloudfrontURL = `https://d2vui8vf8m6hcm.cloudfront.net/processed/${filename}.json`; // Replace with your CloudFront domain

  for (let i = 0; i < 10; i++) { // Try for ~50 seconds total
    try {
      const res = await fetch(cloudfrontURL, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        console.log("CloudFront Response:", data);

        responseBox.innerHTML = `
          <h3>AI Recognition Result:</h3>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        `;
        return;
      } else {
        console.log(`Attempt ${i + 1}: result not ready yet`);
      }
    } catch (err) {
      console.log(`Attempt ${i + 1}: still waiting for result...`);
    }

    // Wait 5 seconds before retry
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  responseBox.innerHTML = `
    <p style="color:red;">
      Processed result not available yet. Please try again later.
    </p>
  `;
}

// 4️⃣ Handle form submission
imageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = imageInput.files[0];
  if (!file) return alert("Please select an image first.");

  const reader = new FileReader();
  reader.onload = function (event) {
    const base64Data = event.target.result.split(",")[1];
    sendData(file.name, base64Data);
  };
  reader.readAsDataURL(file);
});

