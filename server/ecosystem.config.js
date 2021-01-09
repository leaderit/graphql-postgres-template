module.exports = [{
    script  : 'server.js',
    name    : 'server',
    watch   : true,
    ignore_watch: [
        'public',
        'node_modules',
        'storage'
    ]
    // exec_mode: 'cluster',
    // instances: 2
}]

  