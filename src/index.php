
<?php

$routes = explode("/", $_SERVER["REQUEST_URI"]);
$api = "https://chaskigo-d719c-default-rtdb.firebaseio.com/"; // YOUR FIREBASE ENDPOINT

$url = "http://chaskigo.com"; // YOUR DOMAIN

if(!empty($routes[2])){
	/*=============================================
	Filtramos producto
	=============================================*/
	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => $api."products.json?orderBy=%22url%22&equalTo=%22".$routes[2]."%22&print=pretty",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 0,
	  CURLOPT_FOLLOWLOCATION => true,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "GET",
	));
	$response = curl_exec($curl);
	curl_close($curl);

	$jsonResponse = json_decode($response, true);
	if(!empty($jsonResponse)){
		$id = $jsonResponse[array_keys($jsonResponse)[0]];
		/*=============================================
		Título
		=============================================*/

		$title = $id["name"];
		/*=============================================
		Descripción
		=============================================*/
		$summary = json_decode($id["summary"],true);
		$description = "";
		foreach ($summary as $key => $value) {

			$description .= $value.", ";
		}
		$description = substr($description, 0, -2);
		/*=============================================
		Palabras Claves
		=============================================*/
		$tagsArray = json_decode($id["tags"],true);
		$tags = "";
		foreach ($tagsArray as $key => $value) {

			$tags .= $value.", ";
		}
		$tags = substr($tags, 0, -2);
		/*=============================================
		Imagen de portada
		=============================================*/

		$image = "assets/img/products/".$id["category"]."/".$id["image"];
		/*=============================================
		Completamos la URL
		=============================================*/

		$url = $url."product/".$id["url"];
	}else{
		/*=============================================
		Filtramos categoría
		=============================================*/
		$curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => $api."categories.json?orderBy=%22url%22&equalTo=%22".$routes[2]."%22&print=pretty",
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => "",
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 0,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => "GET",
		));
		$response = curl_exec($curl);
		curl_close($curl);

		$jsonResponse = json_decode($response, true);

		if(!empty($jsonResponse)){
			$id = $jsonResponse[array_keys($jsonResponse)[0]];
			/*=============================================
			Título
			=============================================*/

			$title = $id["name"];
			/*=============================================
			Descripción
			=============================================*/
			$description = "Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum.";

			/*=============================================
			Palabras Claves
			=============================================*/
			$tagsArray = json_decode($id["title_list"],true);
			$tags = "";
			foreach ($tagsArray as $key => $value) {

				$tags .= $value.", ";
			}
			$tags = substr($tags, 0, -2);
			/*=============================================
			Imagen de portada
			=============================================*/

			$image = "assets/img/categories/".$id["image"];
		}
	}
}
?>
<!doctype html>
<html lang="es">
<head>
    <base href="/">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="author" content="">
    <meta name="keywords" content="">
    <meta name="description" content="">
    <?php if (empty($jsonResponse)): ?>
    <title>ChaskiGo | Home</title>
    <link rel="icon" href="assets/img/template/favicon.png">
    <!--=====================================
	CSS
	======================================-->
    <!-- google font -->
    <link href="https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700&display=swap" rel="stylesheet">
    <!-- font awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <!-- linear icons -->
    <link rel="stylesheet" href="assets/css/plugins/linearIcons.css">
    <!-- Bootstrap 4 -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <!-- Owl Carousel -->
    <link rel="stylesheet" href="assets/css/plugins/owl.carousel.css">
    <!-- Slick -->
    <link rel="stylesheet" href="assets/css/plugins/slick.css">
    <!-- Light Gallery -->
    <link rel="stylesheet" href="assets/css/plugins/lightgallery.min.css">
    <!-- Font Awesome Start -->
    <link rel="stylesheet" href="assets/css/plugins/fontawesome-stars.css">
    <!-- jquery Ui -->
    <link rel="stylesheet" href="assets/css/plugins/jquery-ui.min.css">
    <!-- Select 2 -->
    <link rel="stylesheet" href="assets/css/plugins/select2.min.css">
    <!-- Scroll Up -->
    <link rel="stylesheet" href="assets/css/plugins/scrollUp.css">
    <!-- DataTable -->
    <link rel="stylesheet" href="assets/css/plugins/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" href="assets/css/plugins/responsive.bootstrap.datatable.min.css">
    <!-- Nite Alert -->
    <link rel="stylesheet" type="text/css" href="assets/css/plugins/notie.css">
    <!-- Placeholder Loading -->
    <link rel="stylesheet" type="text/css" href="assets/css/plugins/placeholder-loading.css">
    <!-- estilo principal -->
    <link rel="stylesheet" href="assets/css/style.css">
    <!-- Datepicker -->
    <link rel="stylesheet" type="text/css" href="assets/css/plugins/bootstrap-datepicker.min.css">
    <!-- Market Place 4 -->
    <link rel="stylesheet" href="assets/css/market-place-4.css">
    <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/plugins/whatsapp.css">
    <!--=====================================
	PLUGINS JS
	======================================-->
    <!-- jQuery library -->
    <script src="assets/js/plugins/jquery-1.12.4.min.js"></script>
    <!-- Popper JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <!-- Latest compiled JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
    <!-- Owl Carousel -->
    <script src="assets/js/plugins/owl.carousel.min.js"></script>
    <!-- Images Loaded -->
    <script src="assets/js/plugins/imagesloaded.pkgd.min.js"></script>
    <!-- Datepicker -->
    <!-- https://bootstrap-datepicker.readthedocs.io/en/latest/ -->
    <script src="assets/js/plugins/bootstrap-datepicker.min.js"></script>
    <!-- Masonry -->
    <script src="assets/js/plugins/masonry.pkgd.min.js"></script>
    <!-- Isotope -->
    <script src="assets/js/plugins/isotope.pkgd.min.js"></script>
    <!-- jQuery Match Height -->
    <script src="assets/js/plugins/jquery.matchHeight-min.js"></script>
    <!-- Slick -->
    <script src="assets/js/plugins/slick.min.js"></script>
    <!-- jQuery Barrating -->
    <script src="assets/js/plugins/jquery.barrating.min.js"></script>
    <!-- Slick Animation -->
    <script src="assets/js/plugins/slick-animation.min.js"></script>
    <!-- Light Gallery -->
    <script src="assets/js/plugins/lightgallery-all.min.js"></script>
    <script src="assets/js/plugins/lg-thumbnail.min.js"></script>
    <script src="assets/js/plugins/lg-fullscreen.min.js"></script>
    <script src="assets/js/plugins/lg-pager.min.js"></script>
    <!-- jQuery UI -->
    <script src="assets/js/plugins/jquery-ui.min.js"></script>
    <!-- Sticky Sidebar -->
    <script src="assets/js/plugins/sticky-sidebar.min.js"></script>
    <!-- Slim Scroll -->
    <script src="assets/js/plugins/jquery.slimscroll.min.js"></script>
    <!-- Select 2 -->
    <script src="assets/js/plugins/select2.full.min.js"></script>
    <!-- Scroll Up -->
    <script src="assets/js/plugins/scrollUP.js"></script>
    <!-- DataTable -->
    <script src="assets/js/plugins/jquery.dataTables.min.js">
    </script>
    <script src="assets/js/plugins/dataTables.bootstrap4.min.js">
    </script>
    <script src="assets/js/plugins/dataTables.responsive.min.js"></script>
    <!-- Chart -->
    <script src="assets/js/plugins/Chart.min.js"></script>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Pagination -->
    <!-- https://www.jqueryscript.net/other/Simple-Customizable-Pagination-Plugin-with-jQuery-Bootstrap-Twbs-Pagination.html -->
    <script src="assets/js/plugins/pagination.min.js"></script>
    <!-- Sweetalert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>
    <!-- PayPhone -->
    <script src="https://pay.payphonetodoesposible.com/api/button/js?appId=EqlNxUZ5jEuDzT272Ku9Vg"></script>
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.js"></script>
</head>
<body class="mat-typography">
    <!--=====================================
	JS PERSONALIZADO
	======================================-->
    <script src="assets/js/main.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.12.6/system.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <a href="https://wa.me/c/593987938987" class="float" target="_blank">
        <i class="fa fa-whatsapp my-float"></i>
    </a>
    <app-root></app-root>
</body>
</html>
