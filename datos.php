<?php
header("Content-Type: text/plain; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");

$nombreArchivo = "equipos_talayote.csv";

if (file_exists($nombreArchivo)) {
    readfile($nombreArchivo);
} else {
    http_response_code(404);
    echo "Error: El archivo '$nombreArchivo' no se encuentra.";
}
?>