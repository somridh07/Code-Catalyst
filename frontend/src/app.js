const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const imageForm = document.getElementById('imageForm');

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

imageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = imageInput.files[0];
    if(file) {
        alert('Image ready for verification and recognition!');
        // Here you can call your backend API using fetch/AJAX
    } else {
        alert('Please select an image first.');
    }
});
