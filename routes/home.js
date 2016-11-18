var express = require('express');
var router = express.Router();

function makeHomePage(data) {
    var pageTitle = data.pageTitle;
    var username = data.username;

    var homeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="apple-touch-icon-precomposed" href="favicon.png">
<link rel="icon" href="/favicon.png">
<title>VzBlog - ${pageTitle}</title>
<meta name="description" content="IMAD NPTEL online course 2016 web app" />
<meta name="keywords" content="Vatsal, imad, nptel, VaTz88" />
<meta name="author" content="Vatsal Joshi" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" />
<link href="/css/common.css" rel="stylesheet">
<link href="/css/home.css" rel="stylesheet">
</head>
<body>
	<header>

<nav class="navbar navbar-default navbar-static-top">
	<div class="container-fluid">
		<div class="navbar-header">
    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#mainNavBar"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>

    <a class="navbar-brand" href="/">VzBlog</a></div>

    <div class="collapse navbar-collapse" id="mainNavBar">
				<ul class="nav navbar-nav">
					<li id="blogNavButton"><a href="/">Home</a></li>
				</ul>
				<form id="searchBlog-form" class="navbar-form navbar-left">
					<div class="form-group">
						<input id="searchBlog-value" type="text" class="form-control" name="searchBlog" placeholder="Search articles, authors" required>
						<button id="searchBlog-btn" type="submit" class="btn btn-default">Search</button>
					</div>
				</form>
				<ul class="nav navbar-nav navbar-right">
					<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-user"></span> ${username}<span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="/profile">Profile</a></li>
							<li><a href="/dashboard">Dashboard</a></li>
							<li><a href="/logout">Log Out</a></li>
						</ul>
					</li>
				</ul>
			</div>

    </div>
</nav>
<div id="loader" style="display:none;"></div>
	</header>
	<main>
		<div class="container animate-bottom">
		</div>
	</main>
<footer class="container-fluid">
    <div class="text-center">
        <span>Made with ♥ by <a href="http://vatz88.in/" target="_blank">Vatsal</a></span>
    </div>
</footer>
	<!-- cndjs -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Readmore.js/2.2.0/readmore.min.js"></script>
    <!-- common js -->
    <script src="/js/common.js"></script>
	<script src="/js/home.js"></script>
</body>
</html>
    `;

    return homeHTML;
}

router.get('/', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        res.send(makeHomePage(
            {
                pageTitle: "Home",
                username: req.session.auth.username
            }
        ));
    } else {
        res.redirect('/login');
    }
});

module.exports = router;