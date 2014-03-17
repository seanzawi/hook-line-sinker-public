Hook Line Sinker
============

Hook line sinker is an autodeploy server built for simplicity and modularity.



### Disclaimer

This project is very early on, has limited testing and the api may very well change in the future.  Feel free to send along a pull request or submit bugs.  The more help the merrier.

There are a number of limitations with this project.  These limitations include (but are not limited to): only pulling down and running the master branch, not allowing more than one server/port, and not allowing `npm start` as a start script.  There is also a security risk that currently anyone can hit the exposed endpoint to pull down the latest code (e.g. /repo/{name of repo}).  We currently do nothing to protect the server from thrashing after having the endpoint hit n times.



## Use

The most important part of the options is the repo.url.  This allows you to specify a url and have it automagically cloned, installed, and started.  The start script for each repo is set as `node index.js` by default, but can be overwritten in the repo object.  The port option sets which port you want to have hook-line-sinker running on (preferrably one that you won't have your server(s) running on).

```shell
var options = 
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
}

var Hook = require('hook-line-sinker');

	hook = new Hook(options);
```


## Advanced

Hook Line Sinker uses event emitters to allow you to track the state of your server deploy and add additional functionality. Current events you can listen for are: `commit`, `pulled`, `installed`, `started`; all of which pass the in action.  Additionally, there is a `log` event for showing all of the logs from hook-line-sinker.


```shell
var Hook = require('hook-line-sinker');

	hook = new Hook(options);

	hook.on('commit', function(result)
	{
		...
	});
```

You can even use create your own events that you listen to:


```shell
var Hook = require('hook-line-sinker');

	hook = new Hook(options);

	hook.emit('tested', function(result)
	{
		...
	});

	hook.on('tested', function(result)
	{
		...
	});
```
