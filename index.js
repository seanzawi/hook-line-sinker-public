var assert			= require('assert'),
	events			= require('events').EventEmitter,
	fs				= require('fs'),
	git				= require('gift'),
	initialize		= require('./lib/initialize'),
	path			= require('path'),
	restify			= require('restify'),
	routes			= require('./lib/routes.js'),
	serverControl	= require('./lib/start_server'),
	shell			= require('shelljs'),
	url				= require('url')
	;

module.exports = function(options)
{
	if (!options)
		options = {};

	var opts	=
		{
			port:		options.port    || 9001,
			verbose:	(options.verbose == null) ? true : options.verbose,
			basePath:	options.basePath || process.cwd()
		};

	if(Array.isArray(options.repo))
		opts.repo = options.repo;
	else
		opts.repo = [options.repo];

	var server = restify.createServer();
	var servers = {};
	var repo_names = {};
	opts.repo.forEach(function(repository, index)
	{
		if(repository.start == null)
			repository.start = 'node index.js';
		if(repository.install == null)
			repository.install = 'npm i';

		assert(repository.url != null, 'you must provide a valid git url');
		repo_names[path.basename(url.parse(repository.url).pathname, '.git')] = repository;
	});
	opts.repo = repo_names;
	initialize(opts, postServer);

	function serverPull(repository, next)
	{
		var repo = git(path.join(opts.basePath, 'hook-line-sinker-repo', repository));
		repo.sync(function(err, res)
		{
			next();
		});
	}

	function serverInstall(repository, next)
	{
		var repo = path.join(opts.basePath, 'hook-line-sinker-repo', repository);
		shell.exec('cd ' + repo + ' && ' + opts.repo[repository].install, function (code, output)
		{
			server.emit('log', 'npm install exit code: ' + code);
			server.emit('log', 'npm install output: ' + output);
			next();
		});
	}

	function serverStart(repository, next)
	{
		var child_server;
		if(servers[repository])
		{
			serverControl.stop(child_server);
			child_server = serverControl.start(repository, opts.repo[repository].start);
		}
		else
			child_server = serverControl.start(repository, opts.repo[repository].start);
		servers[repository] = child_server;
		next();
	}

	function getList(req, res, next)
	{
		res.send(200, Object.keys(servers));
		next (req, res);
	}

	server.on('commit', function(repository)
	{
		server.emit('log', 'Received a commit ' + repository);
		serverPull(repository, function(){ server.emit('pulled', repository); });
	});

	server.on('pulled', function(repository)
	{
		server.emit('log', 'Starting pulling now ' + repository);
		serverInstall(repository, function(){ server.emit('installed', repository); });
	});

	server.on('installed', function(repository)
	{
		server.emit('log', 'Pulling finished, starting installing ' + repository);
		serverStart(repository, function(){ server.emit('started', repository); });
	});

	server.on('started', function(repository)
	{
		server.emit('log', 'The server ' + repository + ' is now started');
	});
	if(opts.verbose)
	{
		server.on('log', function(logs)
		{
			console.log(logs);
		});
	}



	server.use(restify.bodyParser());
	server.use(restify.CORS());

	server.get('/', function(req, res, next)
	{
		res.header('Location', '/list');
		res.send(302);
	});
	server.post('/repo/:name', routes.postRepo, function(req, res, next){server.emit('commit', req.params.name);});
	server.get('/results/:name', function(req, res, next) {routes.getList(req, res, next, servers);});
	server.get('/list', getList);
	server.get('/ping', routes.ping);

	server.listen(opts.port, function() {
		server.emit('log', 'hook-line-sinker listening at http://localhost:'+opts.port);
	});

	function postServer(err, items)
	{
		if (err)
		{
			server.emit('log', 'Server failed to initialize.');
			return server.emit('error', err);
		}
		server.emit('log', 'Server has been initialized, moving on to pulling code down.');
		items.forEach(function(item)
		{
			server.emit('commit', item);
		});
	}

	return server;
};
