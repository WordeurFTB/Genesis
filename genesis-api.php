<?php
try {
    $host = 'localhost';
	$dbname = 'genesis';
	$charset = 'utf8';
	$port = 3306;
	$user = 'root';
	$password = '';
	$db = new PDO("mysql:host=$host;dbname=$dbname;charset=$charset;port=$port", $user, $password);
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		$action = $data->action;
		if ($action == 'create-user') {
			$firstname = $data->firstname;
			$lastname = $data->lastname;
			$email = $data->email;
			$password = $data->password;
			date_default_timezone_set('Europe/Paris');
			$date = date('Y-m-d h:i:s');
			$token = hash('sha256', $email . $date);
			$control = true;
			if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $control = false; }
			$query = $db->prepare("SELECT email FROM users ORDER BY id;");
			$query->execute();
			$result = $query->fetchAll(PDO::FETCH_ASSOC);
			if (!(count($result) == 0)) { $control = false; }
			if ($control === true) {
				$query = $db->prepare("INSERT INTO users (email, token, password, firstname, lastname, created, modified) VALUES (?, ?, ?, ?, ?, ?, ?);");
				$query->execute([$email, $token, $password, $firstname, $lastname, $date, $date]);
			}
		} else if ($action == 'connect-user') {
			$email = $data->email;
			$password = $data->password;
			$control = false;
			$query = $db->prepare("SELECT token FROM users WHERE email = ? AND password = ?;");
			$query->execute([$email, $password]);
			$result = $query->fetchAll(PDO::FETCH_ASSOC);
			$control = true;
			if (!(count($result) > 0)) { $control = false; }
			$obj = new stdClass;
			if ($control === true) {
				foreach (array_keys($result[0]) as $key) {
					$obj->{$key} = $result[0][$key];
				}
			}
			if ($result) {
				header('HTTP/1.0 200 OK');
				echo json_encode($obj);
			} else {
				header('HTTP/1.0 403 Forbidden');
			}
		}
	}
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>