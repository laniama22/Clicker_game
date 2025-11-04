<?php
include 'db.php';

// get the score from the request
if (isset($_POST)) {
    $score = $_POST;
} else {
    die("No score provided");
}

if (!isset($score['name']) || !isset($score['score'])) {
    die("Invalid score data");
}

$name = $score['name'];
$score = $score['score'];

$sql = "INSERT INTO scores (name, score) VALUES (:name, :score)";
$stmt = $db->prepare($sql);
$stmt->bindParam(':name', $name);
$stmt->bindParam(':score', $score);
$stmt->execute();






?>