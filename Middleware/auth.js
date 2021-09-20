// auth.js`

const jwt = require('jsonwebtoken');
const User = require('../Model/userModel')
const globalConst = require('../Constant/constants');

const auth = async (req, res, next) => {
    try {
        const horrorMapAuth = req.header('Horror-Map-Authorization');
        if (horrorMapAuth == '' || horrorMapAuth == null || horrorMapAuth != process.env.HORROR_MAP_AUTHORIZATION) {
            const error = new Error();
            error.code = 10002;
            error.suberror_msg = 'Missing Horror-Map-Authorization Header';
            throw error;
        }

        const token_auth_excemption_list = [
            '/user/login',
            '/user/create'
        ];

        if (!token_auth_excemption_list.includes(req.path)) {
        // if (!(req.path == '/user/login')) {
            let token = req.header('Authorization');

            if (token == '' || token == null) {
                const error = new Error();
                error.code = 10003;
                error.suberror_msg = 'Missing Token. Please Login first.';
                throw error;
            }

            token = token.replace('Bearer ', '');

            let decoded;
            try {
                decoded = await jwt.verify(token, process.env.JWT_KEY);
            } catch (e) {
                const error = new Error();
                error.code = 10004;
                error.suberror_msg = 'Invalid Token. Please Login again.';
                throw error; 
            }
 
            const query = [
                { id: decoded._id },
                { 'tokens.token': token }
            ];

            const userData = await User.findOne({$and: query});
            
            if (null==userData || ''==userData || !userData) {
                const error = new Error();
                error.code = 10005;
                error.suberror_msg = 'Invalid Token. Token did not match any user.';
                throw error;                    
            }

            req.user = userData;
            req.token = token;
        }
        next();
    } catch (error) {
        res.status(401).send({
            status: 0,
            code: error.code??10001,
            error_msg: 'Not authorized to access this resource',
            suberror_msg: error.suberror_msg??globalConst.EXCEPTION_ERROR
        });
    }

}
module.exports = auth