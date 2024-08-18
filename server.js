const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Database connection configuration
const db = mysql.createConnection({
  host: 'bgjo6wpqzweglg5jn2m0-mysql.services.clever-cloud.com',
  user: 'uxkdlftngtwx5f5s',
  password: '63qSLEZl49b84Ig7EnyK',
  database: 'bgjo6wpqzweglg5jn2m0'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Connection Error: ' + err.stack);
    return;
  }
  console.log('Connection Successful!');
});

app.get('/', (req, res) => {
  const sql = "SELECT * FROM courses";
  db.query(sql, (err, results) => {
    if (err) {
      console.error('SQL query is not working!', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Course Cards</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        .course-card {
            transition: transform 0.3s;
            height: 100%;
        }

        .course-card:hover {
            transform: translateY(-5px);
        }

        .card-img-top {
            height: 200px;
            object-fit: cover;
        }

        .card-body {
            display: flex;
            flex-direction: column;
        }

        .card-text {
            flex-grow: 1;
        }

        .price {
            font-size: 1.25rem;
            font-weight: bold;
            color: #28a745;
        }

        .category {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
        }

        .video-link {
            color: #007bff;
            text-decoration: none;
        }

        .video-link:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="container my-5" style="height: auto;">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">`;

    if (results.length > 0) {
      results.forEach(row => {
        html += `
        <div class="col">
            <div class="card course-card shadow">
                <img src="${escapeHtml(row.image)}" class="card-img-top" alt="${escapeHtml(row.title)}">
                <div class="category">${escapeHtml(row.category)}</div>
                <div class="card-body">
                    <h5 class="card-title">${escapeHtml(row.title)}</h5>
                    <p class="card-text">${escapeHtml(row.description)}</p>
                    <a href="${escapeHtml(row.video)}" class="video-link" target="_blank">
                        <i class="fas fa-play-circle"></i> Watch Preview
                    </a>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="price">RS.${escapeHtml(row.price)}</span>
                        <div class="rating">`;

        const rating = parseFloat(row.rating);
        for (let i = 1; i <= 5; i++) {
          if (i <= rating) {
            html += '<i class="fas fa-star text-warning"></i>';
          } else if (i - 0.5 <= rating) {
            html += '<i class="fas fa-star-half-alt text-warning"></i>';
          } else {
            html += '<i class="far fa-star text-warning"></i>';
          }
        }

        html += `
                            <span class="ms-1"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
      });
    } else {
      html += '<p>No courses found in the database.</p>';
    }

    html += `
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>`;

    res.send(html);
  });
});

// Helper function to escape HTML special characters
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
