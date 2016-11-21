var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var crypto = require('crypto');
var pool = app.get('pool');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

function hash(password) {
    var key = crypto.pbkdf2Sync(password, 'VzSalt', 10000, 512, 'sha512');
    return key.toString('hex');
}


function makeLoginPage(data) {

    var userName = data.userName;
    var pageTitle = data.pageTitle;
    var msg = data.msg;

    var loginHTML = `
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

	<link href="/css/login.css" rel="stylesheet">
</head>

<body>

	<header>

<nav class="navbar navbar-default navbar-static-top">
	<div class="container-fluid">
		<div class="navbar-header">`;
    if (userName) {
        loginHTML += `<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#mainNavBar"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>`;
    }

    loginHTML += `<a class="navbar-brand" href="/">VzBlog</a></div>`;

    if (userName) {
        loginHTML += `<div class="collapse navbar-collapse" id="mainNavBar">
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
					<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-user"></span> ${userName}<span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="/profile">Profile</a></li>
							<li><a href="/dashboard">Dashboard</a></li>
							<li><a href="/logout">Log Out</a></li>
						</ul>
					</li>
				</ul>
			</div>`;
    }

    loginHTML += `</div>
</nav>

<div id="loader" style="display:none;"></div>

    </header>

	<main>
		<div class="container">`;

    if (msg) {
        loginHTML += `<div class="alert alert-info alert-dismissible" role="alert">
  			<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  			${msg}
			</div>`;
    }
    loginHTML += `<form method="POST" action="/login">
				<div class="form-group">
					<div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" class="form-control" name="email" id="email" placeholder="Your email id here" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" name="password" id="password" placeholder="At least 4 characters long" pattern=".{4,}" required title="Password must be at least 4 characters long">
                    </div>
				</div>
				<button type="submit" class="btn btn-default">Log In / Sign Up</button>
			</form>
		</div>
	</main>

	<footer class="container-fluid">
        <div class="text-center">
            <span>Made with ♥ by <a href="http://vatz88.in/" target="_blank">Vatsal</a></span>
        </div>
    </footer>

	<!-- JavaScript -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Readmore.js/2.2.0/readmore.min.js"></script>
    <!-- common js -->
    <script src="/js/common.js"></script>
	<script src="/js/login.js"></script>

</body>

</html>
`;

    return loginHTML;
}


router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = hash(req.body.password);

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!(req.body.password.length >= 4 && re.test(email))) {
        res.status(403).send(makeLoginPage(
            {
                pageTitle: "Login",
                userName: false,
                msg: "Please give a valid email id and password"
            }
        ));
    } else {
        pool.connect(function (err, client, done) {
            if (err) {
                res.status(500).send(err.toString());
            }
            else {
                client.query('SELECT * FROM "user" WHERE UPPER(email_id) = UPPER($1)', [email], function (err, result) {
                    if (err) {
                        res.status(500).send(err.toString());
                    }
                    if (result.rows.length == 1) {
                        // user exist
                        if (password == result.rows[0].password) {
                            // set session
                            req.session.auth = { userId: result.rows[0].user_id, username: result.rows[0].username };
                            res.redirect('/');
                        } else {
                            res.status(403).send(makeLoginPage(
                                {
                                    pageTitle: "Login",
                                    userName: false,
                                    msg: "Email id / Password incorrect. Please try again."
                                }
                            ));
                        }
                    } else if (result.rows.length == 0) {
                        // create user
                        var newusername = email.split('@')[0];
                        client.query('INSERT INTO "user" ("email_id", "password", "username") VALUES ($1, $2, $3)', [(email), (password), (newusername)], function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                client.query('SELECT * FROM "user" WHERE UPPER(email_id) = UPPER($1)', [email], function (err, result) {
                                    client.query('INSERT INTO "user_details" ("user_id", "first_name") VALUES ($1, $2)', [result.rows[0].user_id, (newusername)], function (err, result) {
                                        if (err) {
                                            res.status(500).send(err.toString());
                                        }
                                    });
                                    req.session.auth = { userId: result.rows[0].user_id, username: result.rows[0].username };
                                    res.redirect('/profile');
                                });
                            }
                        });
                    }
                    done();
                });
            }
        });
    }
});

router.get('/login', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        res.redirect('/');
    } else {
        res.send(makeLoginPage(
            {
                pageTitle: "Login",
                userName: false,
                msg: false
            }
        ));
    }
});

router.get('/logout', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        delete req.session.auth;
    }
    res.redirect('/login');
});

module.exports = router;