const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
    app.use(
        createProxyMiddleware(
            '/meetings',{
            target: 'http://43.200.79.42:3000',
            changeOrigin: true,
        })
    );
};