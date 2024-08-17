<?php

//Building the connection
$server = "bgjo6wpqzweglg5jn2m0-mysql.services.clever-cloud.com";
$user = "uxkdlftngtwx5f5s";
$password = "63qSLEZl49b84Ig7EnyK";
$database = "bgjo6wpqzweglg5jn2m0";

//Configuring the connection
$conn = new mysqli($server, $user, $password, $database);

//Checking the connection
if ($conn->connect_error) {
    die("Connection Error: " . $conn->connect_error);
} else {
    echo "<script>console.log('Connection Successful!');</script>";
}

//Retrieving the data from the database
$sql = "SELECT * FROM courses";
$result = $conn->query($sql);

if (!$result) {
    echo "SQL query is not working!";
    exit;
}

echo '<!DOCTYPE html>
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
    <div class="container my-5">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">';

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo '<div class="col">
            <div class="card course-card shadow">
                <img src="' . htmlspecialchars($row['image']) . '" class="card-img-top" alt="' . htmlspecialchars($row['title']) . '">
                <div class="category">' . htmlspecialchars($row['category']) . '</div>
                <div class="card-body">
                    <h5 class="card-title">' . htmlspecialchars($row['title']) . '</h5>
                    <p class="card-text">' . htmlspecialchars($row['description']) . '</p>
                    <a href="' . htmlspecialchars($row['video']) . '" class="video-link" target="_blank">
                        <i class="fas fa-play-circle"></i> Watch Preview
                    </a>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="price">RS.' . htmlspecialchars($row['price']) . '</span>
                        <div class="rating">';

        $rating = floatval($row['rating']);
        for ($i = 1; $i <= 5; $i++) {
            if ($i <= $rating) {
                echo '<i class="fas fa-star text-warning"></i>';
            } elseif ($i - 0.5 <= $rating) {
                echo '<i class="fas fa-star-half-alt text-warning"></i>';
            } else {
                echo '<i class="far fa-star text-warning"></i>';
            }
        }

        echo '<span class="ms-1">' . '</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>';
    }
} else {
    echo '<p>No courses found in the database.</p>';
}

echo '</div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>';

$conn->close();
