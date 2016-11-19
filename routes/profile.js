var express = require('express');
var router = express.Router();
var pool = app.get('pool');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

function createProfile(data) {

    var pageTitle = data.pageTitle;
    var username = data.username;
    var first_name = data.first_name;
    var last_name = data.last_name;
    var bio = data.bio;
    var email_id = data.email_id;

    var profileHTML = `

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
	<link href="/css/profile.css" rel="stylesheet">
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
			<div class="alert alert-info alert-dismissible" role="alert">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<span id="alert-msg"></span>
			</div>
			<form class="form-horizontal" id="profileForm" method="POST" action="/profile">
				<div class="form-group">
					<label for="first_name" class="col-sm-2 control-label">username</label>
					<div class="col-sm-10">
						<input type="text" class="form-control" name="username" placeholder="username" value="${username}" required>
					</div>
				</div>
				<div class="form-group">
					<label for="first_name" class="col-sm-2 control-label">First name</label>
					<div class="col-sm-10">
						<input type="text" class="form-control" name="first_name" placeholder="first name" value="${first_name}" required>
					</div>
				</div>
				<div class="form-group">
					<label for="last_name" class="col-sm-2 control-label">Last name</label>
					<div class="col-sm-10">
						<input type="text" class="form-control" name="last_name" placeholder="last name" value="${last_name}" required>
					</div>
				</div>
					<div class="form-group">
						<label for="email" class="col-sm-2 control-label">Email id</label>
						<div class="col-sm-10">
							<input type="email" class="form-control" name="email" placeholder="example@abc.com" value="${email_id}" required>
						</div>
					</div>
						<div class="form-group">
							<label for="bio" class="col-sm-2 control-label">Bio</label>
							<div class="col-sm-10">
								<textarea class="form-control" rows="3" name="bio">${bio}</textarea>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-offset-2 col-sm-10">
								<button type="submit" class="btn btn-default">Update</button>
							</div>
						</div>
			</form>
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
	<script src="/js/profile.js"></script>
</body>
</html>

    `;

    return profileHTML;
}

router.get('/profile', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.status(500).send(err.toString());
            }
            else {
                client.query('SELECT * FROM "user" , "user_details" WHERE "user_details".user_id = "user".user_id AND user_details.user_id = $1', [req.session.auth.userId], function (err, result) {
                    done();
                    if (err) {
                        res.status(500).send(err.toString());
                    } else {
                        res.status(200).send(createProfile(
                            {
                                pageTitle: "Profile",
                                username: result.rows[0].username,
                                first_name: result.rows[0].first_name,
                                last_name: result.rows[0].last_name,
                                bio: result.rows[0].bio,
                                email_id: result.rows[0].email_id,
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

router.post('/profile', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (req.body.first_name === "" || req.body.last_name === "" || req.body.username === "") {
                    done();
                    res.status(200).send("Please give all required fields in their valid format");
                } else {
                    client.query('UPDATE "user_details" SET "first_name" = $1, "last_name" = $2, "bio" = $3 WHERE "user_id" = $4', [(req.body.first_name), (req.body.last_name), (req.body.bio), (req.session.auth.userId)], function (err, result) {
                        if (err) {
                            res.status(500).send(err.toString());
                        }
                        else {
                            client.query('UPDATE "user" SET "username" = $1, "email_id" = $2 WHERE "user_id" = $3', [(req.body.username), (req.body.email), (req.session.auth.userId)], function (err, result) {
                                done();
                                if (err) {
                                    res.status(500).send(err.toString());
                                } else {
                                    req.session.auth.username = req.body.username;
                                    res.status(200).send("Your profile has been updated.");
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        res.locals.msg = "Session expired, please log in again.";
        res.status(200).render('login', {
            pageTitle: "login",
            username: false
        });
    }
});

module.exports = router;