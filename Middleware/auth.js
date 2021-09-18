// auth.js`

const jwt = require('jsonwebtoken');
const User = require('../Model/userModel')

const auth = async (req, res, next) => {
    try {
        const horrorMapAuth = req.header('Horror-Map-Authorization');
        if (horrorMapAuth == '' || horrorMapAuth == null || horrorMapAuth != process.env.HORROR_MAP_AUTHORIZATION) {
            console.log("in")
            throw new Error();
        }

        if (!req.path == '/user') {
            // const token = req.headers["x-access-token"];
            // const token = req.header('Authorization');
            const token = req.header('Authorization').replace('Bearer ', '');
            const data = jwt.verify(token, process.env.JWT_KEY);
            const user = await User.findOne({
                _id: data._id,
                'tokens.token': token
            });
            if (!user) {
                throw new Error()
            }
            req.user = user;
            req.token = token;
        }
        next();

    } catch (error) {
        console.log(error)
        res.status(401).send({
            error: 'Not authorized to access this resource'
        });
    }

}
module.exports = auth