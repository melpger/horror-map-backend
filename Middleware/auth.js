// auth.js`
// All Routes will first be processed here.
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');
const User = require('../Model/userModel')
const globalConst = require('../Constant/constants');
const util = require('../Util/util');

const auth = async (req, res, next) => {
    try {
        //1. Check for Horror-Map-Authorization Header if present and valid.
        const horrorMapAuth = req.header(globalConst.HEADER.HORROR_MAP_AUTHORIZATION);
        if (util.isEmpty(horrorMapAuth) || horrorMapAuth != process.env.HORROR_MAP_AUTHORIZATION) {
            const error = new Error();
            error.code = globalConst.ERROR.ERROR_CODE.MISSING_AUTH_HEADER;
            error.suberror_msg = globalConst.ERROR.SUB_ERROR.MISSING_AUTH_HEADER;
            throw error;
        }
        
        //2. Check for Hash Header if present and valid.
        let hash = req.header(globalConst.HEADER.HASH)?req.header(globalConst.HEADER.HASH).slice(1,-1):'';
        if (util.isEmpty(hash)) {
            const error = new Error();
            error.code = globalConst.ERROR.ERROR_CODE.MISSING_HASH_HEADER;;
            error.suberror_msg = globalConst.ERROR.SUB_ERROR.MISSING_HASH_HEADER;
            throw error;
        }

        //3. Check for User-Agent Header if present and valid.
        let userAgent = req.header(globalConst.HEADER.USER_AGENT);
        if (util.isEmpty(userAgent)) {
            const error = new Error();
            error.code = globalConst.ERROR.ERROR_CODE.MISSING_USER_AGENT_HEADER;
            error.suberror_msg = globalConst.ERROR.SUB_ERROR.MISSING_USER_AGENT_HEADER;
            throw error;
        }

        //4. Check that the Hash is correct with respect to the request body
        var stringbody = JSON.stringify((req.body));
        var bodyhash = cryptojs.MD5(stringbody).toString();
        if ( bodyhash != hash) {
            const error = new Error();
            error.code = globalConst.ERROR.ERROR_CODE.REQUEST_BODY_TEMPERED;
            error.suberror_msg = globalConst.ERROR.SUB_ERROR.REQUEST_BODY_TEMPERED;
            throw error;
        }

        //5. Validate Routes needing Tokens before access (non-login, non-usercreation)
        if (!globalConst.TOKEN_AUTH_EXCEMPTION_LIST.includes(req.path)) {

            //5-1. Check for Authorization(Bearer) Header if present and valid.
            let token = req.header(globalConst.HEADER.AUTHORIZATION);
            if (util.isEmpty(token)) {
                const error = new Error();
                error.code = globalConst.ERROR.ERROR_CODE.MISSING_TOKEN;
                error.suberror_msg = globalConst.ERROR.SUB_ERROR.MISSING_TOKEN;
                throw error;
            }

            //5-2. Verify Bearer Token if Valid
            //Sample : 
            //To Generate : https://www.javainuse.com/jwtgenerator
            //To Validate : https://jwt.io/
            //Use JWT_KEY on both sites
            token = token.replace('Bearer ', '');
            let decoded;
            try {
                decoded = await jwt.verify(token, process.env.ACCESS_JWT_KEY);
            } catch (e) {
                const error = new Error();
                error.code = globalConst.ERROR.ERROR_CODE.INVALID_TOKEN_RELOGIN;
                error.suberror_msg = globalConst.ERROR.SUB_ERROR.INVALID_TOKEN_RELOGIN;
                throw error; 
            }
 
            //5-2-1. Get the ID from the Decoded Bearer Token
            const query = [
                { id: decoded._id },
                { 'tokens.token': token }
            ];

            //5-2-2. Check if the token and id is mapped to a user
            const userData = await User.findOne({$and: query});
            
            if (util.isEmpty(userData) || !userData) {
                const error = new Error();
                error.code = globalConst.ERROR.ERROR_CODE.INVALID_TOKEN_UNMAPPED_USER;
                error.suberror_msg = globalConst.ERROR.SUB_ERROR.INVALID_TOKEN_UNMAPPED_USER;
                throw error;                    
            }

            //5-3. Check if the route being accessed is for Admin only or not
            if (globalConst.ADMIN_LEVEL_ROUTES.includes(req.path) && !userData.isAdmin) {
                const error = new Error();
                error.code = globalConst.ERROR.ERROR_CODE.ADMIN_ONLY_RESOURCE;
                error.suberror_msg = globalConst.ERROR.SUB_ERROR.ADMIN_ONLY_RESOURCE;
                throw error;   
            }

            //5-4. Set user data and token to req for passing to succeeding processing of route
            req.user = userData;
            req.token = token;
        }
        next();
    } catch (error) {
        res.status(401).send({
            status: globalConst.STATUS.FAIL,
            code: error.code??globalConst.ERROR.ERROR_CODE.AUTH_EXCEPTION_ERROR,
            error_msg: globalConst.ERROR.MAIN_ERROR.NO_AUTHORIZATION,
            suberror_msg: error.suberror_msg??globalConst.ERROR.SUB_ERROR.EXCEPTION_ERROR
        });
    }
}
module.exports = auth