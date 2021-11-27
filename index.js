const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');
const util = require('./utils/util');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';

exports.handler = async (event) => {
    console.log('Request Event: ', event);
    let response;
    switch(true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = buildResponse(200, 'Test');
            break;
        case event.httpMethod === 'POST' && event.path === registerPath:
            response = await registerService.register(registerBody);
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            response = buildResponse(200);
            break;
        case event.httpMethod === 'POST' && event.path === verifyPath:
            response = buildResponse(200);
            break;
        default:
            response = buildResponse(404, '404 Notcx Found');
        
    }
    return response;
};


