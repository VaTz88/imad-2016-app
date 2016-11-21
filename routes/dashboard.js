var express = require('express');
var router = express.Router();
var pool = app.get('pool');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

function createDashboard(data) {

	var pageTitle = "Dashboard";
	var username = data.username;
	var allArticle = data.allArticle;
	var totalArticles = data.totalArticles;

	var dashboardHTML = `
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
	<link href="/css/dashboard.css" rel="stylesheet">
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
		<div class="container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title">${username} - Dashboard</h3>
				</div>
				<div class="panel-body">
					<div class="row">
						<div class="col-sm-12">
							<h4>Atricles published by you:</h4>
						</div>
					</div>
					<div>
						<ul class="list-group">`;
	allArticle.forEach(function (item) {
		dashboardHTML += `<li class="list-group-item" id="` + item.article_id.toString() + `">
								<div class="row">
									<span class="col-sm-11 col-md-11 col-lg-11">` + item.article_name.toString() + `</span>
									<span class="col-sm-1 col-md-1 col-lg-1">
										<button title="Remove ` + item.article_name.toString() + `" type="button" aria-label="Remove article" class="btn btn-default btn-sm removeArticleBtn" value="` + item.article_id.toString() + `">
											<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
									</button>
									</span>
								</div>
							</li>`;
	});
	dashboardHTML += `</ul>
					</div>
				</div>
				<div class="panel-footer">
					<div class="row">
						<span class="col-sm-8">Total articles published by you <span class="badge">${totalArticles}</span></span>
						<span class="col-sm-4 text-right"><button id="newArticle-btn" class="btn btn-primary" type="button">New article</button></span>
					</div>
				</div>
				<!-- /panel -->
			</div>
			<!-- alert msg -->
			<div class="alert alert-success alert-dismissible" role="alert">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<span id="alert-msg"></span>
			</div>
			<!-- form -->
			<form class="form-horizontal" id="newArticle-form" method="POST" action="/dashboard">
				<div class="form-group">
					<label for="article_name" class="col-sm-2 control-label">Title</label>
					<div class="col-sm-10">
						<input type="text" class="form-control" name="article_name" placeholder="Article Title" required>
					</div>
				</div>
				<div class="form-group">
					<label for="article_content" class="col-sm-2 control-label">Content</label>
					<div class="col-sm-10">
						<textarea class="form-control" rows="14" name="article_content" placeholder="This article is about..." required></textarea>
					</div>
				</div>
				<div class="form-group">
					<label for="article_content" class="col-sm-2 control-label">Tags</label>
					<div class="col-sm-10">
						<label class="radio-inline"><input type="radio" name="tag" value="Technology">Technology</label>
						<label class="radio-inline"><input type="radio" name="tag" value="Politics">Politics</label>
						<label class="radio-inline"><input type="radio" name="tag" value="Economics">Economics</label>
						<label class="radio-inline"><input type="radio" name="tag" value="History">History</label>
						<label class="radio-inline"><input type="radio" name="tag" value="Spiritual">Spiritual</label>
					</div>
				</div>
				<div class="form-group">
					<div class="col-sm-offset-2 col-sm-10">
						<button type="submit" class="btn btn-default">Publish</button>
					</div>
				</div>
			</form>
			<!-- /container -->
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
	<script src="/js/dashboard.js"></script>

</body>

</html>
    `;

	return dashboardHTML;
}

router.get('/dashboard', function (req, res) {
	if (req.session && req.session.auth && req.session.auth.userId) {
		pool.connect(function (err, client, done) {
			if (err) {
				res.status(500).send(err.toString());
				done();
			}
			else {
				client.query('SELECT * FROM "articles" WHERE user_id = $1', [req.session.auth.userId], function (err, result) {
					done();
					if (err) {
						res.status(500).send(err.toString());
						done();
					} else {
						res.status(200).send(createDashboard(
							{
								pageTitle: "Dashboard",
								username: req.session.auth.username,
								allArticle: result.rows,
								totalArticles: result.rows.length
							}
						));
					}
				});
			}
		});
	} else {
		// session expired
		res.redirect('/login');
	}
});

router.post('/dashboard', function (req, res) {
	if (req.session && req.session.auth && req.session.auth.userId) {
		pool.connect(function (err, client, done) {
			if (err) {
				res.status(500).send(err.toString());
				done();
			} else {
				if (req.body.article_name === "" || req.body.article_content === "") {
					res.status(200).send("Please give all required fields");
				} else {
					// insert into articles
					client.query('INSERT INTO "articles" ("article_name", "article_content", "tag", "user_id") VALUES ($1, $2, $3, $4)', [(req.body.article_name), (req.body.article_content), req.body.tag, req.session.auth.userId], function (err, result) {
						done();
						if (err) {
							res.status(500).send(err.toString());
						}
						else {
							res.status(200).send("Article successfully published.");
						}
					});
				}
			}
		});
	} else {
		// session expired
		res.redirect('/login');
	}
});

module.exports = router;