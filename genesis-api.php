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
		$control = true;
		$obj = new stdClass;
		if ($action == 'create-user') {
			$firstname = $data->firstname;
			$lastname = $data->lastname;
			$email = $data->email;
			$password = $data->password;
			date_default_timezone_set('Europe/Paris');
			$date = date('Y-m-d h:i:s');
			$token = hash('sha256', $email . $date);
			if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $control = false; }
			$query = $db->prepare("SELECT email FROM users WHERE email = ? ORDER BY id;");
			$query->execute([$email]);
			$result = $query->fetchAll(PDO::FETCH_ASSOC);
			if (!(count($result) == 0)) { $control = false; }
			if ($control === true) {
				$query = $db->prepare("INSERT INTO users (email, token, password, firstname, lastname, created, modified) VALUES (?, ?, ?, ?, ?, ?, ?);");
				$query->execute([$email, $token, $password, $firstname, $lastname, $date, $date]);
			}
			if ($control === true) {
				$obj->token = $token;
			}
		} else if ($action == 'connect-user') {
			$email = $data->email;
			$password = $data->password;
			$query = $db->prepare("SELECT token FROM users WHERE email = ? AND password = ?;");
			$query->execute([$email, $password]);
			$result = $query->fetchAll(PDO::FETCH_ASSOC);
			if (!(count($result) > 0)) { $control = false; }
			if ($control === true) {
				foreach (array_keys($result[0]) as $key) {
					$obj->{$key} = $result[0][$key];
				}
			}
		} else if ($action == 'get-user') {
			$token = $data->token;
			$query = $db->prepare("SELECT email, firstname, lastname FROM users WHERE token = ?;");
			$query->execute([$token]);
			$result = $query->fetchAll(PDO::FETCH_ASSOC);
			if (!(count($result) > 0)) { $control = false; }
			if ($control === true) {
				foreach (array_keys($result[0]) as $key) {
					$obj->{$key} = $result[0][$key];
				}
			}
		} else if ($action == 'get-designs') {
			$token = $data->token;
			$query = $db->prepare("SELECT d.id, d.name, d.modified FROM designs AS d, users AS u WHERE d.user = u.id AND u.token = ?;");
			$query->execute([$token]);
			$result = $query->fetchAll(PDO::FETCH_ASSOC);
			if (!(count($result) > 0)) { $control = false; }
			if ($control === true) {
				$count = 0;
				foreach ($result as $design) {
					$obj->{$count} = new stdClass;
					foreach (array_keys($design) as $key) {
						$obj->{$count}->{$key} = $design[$key];
					}
					$count++;
				}
			}
		} else if ($action == 'get-forms') {
			$token = $data->token;
			$query = $db->query('SELECT code, name FROM forms;');
			$result = $query->fetchAll(PDO::FETCH_ASSOC);
			if (!(count($result) > 0)) { $control = false; }
			if ($control === true) {
				$count = 0;
				foreach ($result as $form) {
					$obj->{$count} = new stdClass;
					foreach (array_keys($form) as $key) {
						$obj->{$count}->{$key} = $form[$key];
					}
					$count++;
				}
			}
		} else if ($action == 'get-colors') {
			$token = $data->token;
			$query = $db->query('SELECT code, name, value FROM colors;');
			$result = $query->fetchAll(PDO::FETCH_ASSOC);
			if (!(count($result) > 0)) { $control = false; }
			if ($control === true) {
				$count = 0;
				foreach ($result as $color) {
					$obj->{$count} = new stdClass;
					foreach (array_keys($color) as $key) {
						$obj->{$count}->{$key} = $color[$key];
					}
					$count++;
				}
			}
		} else if ($action == 'get-hologram') {
			$hologram = $data->hologram;
			$token = $data->token;
			$query = $db->prepare('SELECT e.type FROM users AS u, designs AS d, elements as e WHERE e.design = d.id AND d.id = ? AND d.user = u.id AND u.token = ?;');
			$query->execute([$hologram, $token]);
			$result = $query->fetchAll(PDO::FETCH_ASSOC);
			if (!(count($result) > 0)) { $control = false; }
			if ($control === true) {
				$obj->type = $result[0]['type'];
			}
			if ($obj->type === "geo") {
				// ...
			} else if ($obj->type === "img") {
				// ...
			}
		}
		if ($control === true) {
			header('HTTP/1.0 200 OK');
		} else {
			header('HTTP/1.0 403 Forbidden');
		}
		echo json_encode($obj);
	}
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>