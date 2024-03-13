const USER = '/user'
const USER_LOGIN = USER + '/login';
const USER_CREATE = USER + '/create';
    const USER_ME = USER + '/me';
        const USER_ME_LOGOUT = USER_ME + '/logout';
        const USER_ME_LOGOUT_ALL = USER_ME + '/logoutall';
        const USER_ME_DELETE = USER_ME + '/delete';
        const USER_ME_UPDATE = USER_ME + '/update';
const USER_LOGOUT_ALL = USER + '/logoutallUsers';
const USER_GET_ALL = USER + '/getAll';
const USER_GET = USER + '/get';
const USER_DELETE = USER + '/delete';
const USER_UPDATE = USER + '/update';

module.exports = Object.freeze({
    HEADER : {
        HORROR_MAP_AUTHORIZATION: 'Horror-Map-Authorization',
        HASH: 'Hash',
        USER_AGENT: 'User-Agent',
        AUTHORIZATION: 'Authorization',
    },
    STATUS : {
        OK : 1,
        FAIL : 0
    },
    ERROR : {
        MAIN_ERROR : {
            NO_AUTHORIZATION : 'Not authorized to access this resource.',

            //User
            USER_LIST_RETRIEVAL_EXCEPTION_ERROR : 'User List Retrieval Failed.',
            USER_INFO_RETRIEVAL_EXCEPTION_ERROR : 'User Profile Retrieval Failed.',
            USER_LOGOUT_EXCEPTION_ERROR : 'Logout Failed.',
            USER_LOGOUT_ALL_EXCEPTION_ERROR : 'Logout Failed.',
        },
        SUB_ERROR : {
            EXCEPTION_ERROR: 'Something went wrong. Please try again.',

            //Preliminary Authentication Verification
            MISSING_AUTH_HEADER : 'Missing Horror-Map-Authorization Header.',
            MISSING_HASH_HEADER : 'Missing Hash Header.',
            MISSING_USER_AGENT_HEADER : 'Missing User-Agent Header.',
            REQUEST_BODY_TEMPERED : 'Request Body is tampered.',
            MISSING_TOKEN : 'Missing Token. Please Login first.',
            INVALID_TOKEN_RELOGIN : 'Invalid Token. Please Login again.',
            INVALID_TOKEN_UNMAPPED_USER : 'Invalid Token. Token did not match any user.',
            ADMIN_ONLY_RESOURCE : 'Sorry! Only Admin level accounts can access this resource.',

            //User
            EMPTY_USER_LIST : 'User List is Empty.',
        },
        ERROR_CODE : {
            //Preliminary Authentication Verification
            AUTH_EXCEPTION_ERROR: 10001,
            MISSING_AUTH_HEADER : 10002,
            MISSING_HASH_HEADER : 10003,
            MISSING_USER_AGENT_HEADER : 10004,
            REQUEST_BODY_TEMPERED : 10005,
            MISSING_TOKEN : 10006,
            INVALID_TOKEN_RELOGIN : 10007,
            INVALID_TOKEN_UNMAPPED_USER : 10008,
            ADMIN_ONLY_RESOURCE : 10009,

            //User
            USER_LIST_RETRIEVAL_EXCEPTION_ERROR : 10101,
            EMPTY_USER_LIST : 10102,
            USER_INFO_RETRIEVAL_EXCEPTION_ERROR : 10301,
            USER_LOGOUT_EXCEPTION_ERROR : 10401,
            USER_LOGOUT_ALL_EXCEPTION_ERROR : 10501,

        },
    },
    ROUTES : {
        //user related routes
        USER_LOGIN,
        USER_CREATE,
        USER_ME,
        USER_ME_LOGOUT,
        USER_ME_LOGOUT_ALL,
        USER_ME_DELETE,
        USER_ME_UPDATE,
        USER_LOGOUT_ALL,
        USER_GET_ALL,
        USER_GET,
        USER_DELETE,
        USER_UPDATE,
    },
    TOKEN_AUTH_EXCEMPTION_LIST : [
        USER_LOGIN,
        USER_CREATE,
    ],
    ADMIN_LEVEL_ROUTES : [
        USER_UPDATE,
        USER_GET,
        USER_GET_ALL,
        USER_LOGOUT_ALL,
        USER_DELETE,
    ],
});