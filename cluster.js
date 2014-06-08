var cluster = require('cluster'),
    os = require('os'),
    web = require('./web');

if (cluster.isMaster) {
    var cpuCount = os.cpus().length;
    for (var i = 0; i < cpuCount; ++i) {
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        cluster.fork();
    });
} else {
    web.runServer();
}
