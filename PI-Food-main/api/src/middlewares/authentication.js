const authentication = (req, res, next) => {
    console.log('Auth init')
    if(!req.cookies.userId) return res.status(400).send('Must be login');
    next();
};

module.exports = {
    authentication
}