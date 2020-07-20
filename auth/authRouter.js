module.exports = (router, expressApp, authRoutesMethods) => {
    router.post('/register', authRoutesMethods.registerUser);
    router.post('/login', expressApp.oauth.grant(), authRoutesMethods.login);
    return router
};