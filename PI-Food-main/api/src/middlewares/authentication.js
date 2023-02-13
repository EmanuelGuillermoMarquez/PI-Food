const authentication = (req, res, next) => {
    
    if(!req.cookies.userId) return res.status(400).send('Must be login');
    next();
};

module.exports = {
    authentication
}