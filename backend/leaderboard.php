<?php
include 'db.php';

$sql = "SELECT name, score, timestamp FROM clicker_game_leaderboard ORDER BY score DESC LIMIT 10";
$stmt = $db->prepare($sql);
$stmt->execute();
$leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);
if (!$leaderboard) {
    $leaderboard = [];
} else {
    foreach ($leaderboard as &$entry) {
        $entry['score'] = (int)$entry['score'];
    }
}

header('Content-Type: application/json');
echo json_encode($leaderboard);

?>