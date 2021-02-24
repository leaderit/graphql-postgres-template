module.exports = [{
    script  : 'server.js',
    name    : 'server',
    watch   : true,
    // max_memory_restart: '4G',
    ignore_watch: [
        'public',
        'node_modules',
        'storage'
    ]
    // exec_mode: 'cluster',
    // instances: 2
}]

  