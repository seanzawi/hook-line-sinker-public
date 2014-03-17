var Hook	= require('../index'),
	test	= require('tape')
	;

test('Event-emitters firing test', function (t) {
    t.plan(4);

    var hook = new Hook(
	{
		verbose:true,
		repo:
		[
			{url: 'git@github.com:sean17/personal-site.git', start: 'node index.js dev'}
		]
	});
	
	hook.on('commit', function(result)
	{
		t.equal(result, 'personal-site');
	});

	hook.on('pulled', function(result)
	{
		t.equal(result, 'personal-site');
	});

	hook.on('installed', function(result)
	{
		t.equal(result, 'personal-site');
	});

	hook.on('started', function(result)
	{
		t.equal(result, 'personal-site');
		setTimeout(function(){ hook.emit('tests-complete');}, 300);
	});

	hook.on('tests-complete', function()
	{
		process.exit(0);
	});


});