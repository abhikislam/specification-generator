const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Specification Generator</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center">
  <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl">
    <h1 class="text-2xl font-bold mb-6 text-center">Specification Generator</h1>
    <form id="specForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Upload Image (Optional)</label>
        <input type="file" accept="image/*" class="mt-1 block w-full border rounded-md p-2" id="imageInput" name="image"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Brief Description</label>
        <textarea id="description" name="description" rows="4" class="mt-1 block w-full border rounded-md p-2" placeholder="e.g. Mesh-back office chair with cushioned seat and fixed arms"></textarea>
      </div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700">Get Specification</button>
    </form>
    <div id="output" class="mt-6 hidden">
      <h2 class="text-lg font-semibold mb-2">Generated Specification:</h2>
      <div class="bg-gray-50 p-4 rounded-md text-sm text-gray-800" id="specText"></div>
    </div>
  </div>

  <script>
    const specForm = document.getElementById('specForm');
    const output = document.getElementById('output');
    const specText = document.getElementById('specText');

    specForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(specForm);
      const response = await fetch('/api/generate-spec', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        specText.textContent = data.specification;
        output.classList.remove('hidden');
      } else {
        specText.textContent = 'Error: ' + data.message;
        output.classList.remove('hidden');
      }
    });
  </script>
</body>
</html>`;

app.get('/', (req, res) => {
  res.send(htmlPage);
});

app.post('/api/generate-spec', upload.single('image'), (req, res) => {
  const description = req.body.description;
  if (!description || description.trim() === '') {
    return res.status(400).json({ message: 'Description is required.' });
  }

  const spec = `Supplying and placing ${description.trim()}. Structure shall include appropriate materials, ergonomic design, and standard finishing as per site requirement. Final specification may be tailored further based on project needs and image reference.`;

  res.json({ specification: spec });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});