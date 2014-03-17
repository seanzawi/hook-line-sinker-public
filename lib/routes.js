var child		= require('child_process'),
	fs			= require('fs'),
	path		= require('path'),
	shell		= require('shelljs')
	;

module.exports = 
{
	ping: function (request, response)
	{
		var health =
		{
			'status':   'OK',
			'pid':      process.pid,
			'uptime':   process.uptime(),
			'ami':      process.env.EC2_AMI_ID,
			'instance': process.env.EC2_INSTANCE_ID,
		};
		response.json(health);
	},
	postRepo: function (req, res, next)
	{
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.send(200, "");
		res.end();
		next(req, res);
	},
	getList: function (req, res, next)
	{
		res.send(200, servers);
		next (req, res);
	}
};