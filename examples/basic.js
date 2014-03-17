var Hook = require('../index.js')
	;

var hook = new Hook(
	{
		verbose:true,			   // Verbose sends all logs to the console (default - true)
		port:	 8001,             // port for hook-line-sinker to listen on
		repo:					   // array containing repo info
		[
			{
				url:'git@github.com:sean17/personal-site.git',
				start: 'node index.js dev',
				install: 'npm i'
			}
		]
	});

hook.on('commit', function(result)
{
	// console.log('The server just received a commit for ' + result);
});

hook.on('pulled', function(result)
{
	// console.log('The server just pulled down code for ' + result);
});

hook.on('installed', function(result)
{
	// console.log('The server just installed for ' + result);
});

hook.on('started', function(result)
{
	// console.log('The server just started ' + result + ' as a child process');
});