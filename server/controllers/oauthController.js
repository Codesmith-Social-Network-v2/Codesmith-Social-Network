const { CLIENT_SECRET } = require('../secrets.js');
const db = require('../models/UserModel');

const fetch = require('node-fetch');
const { createProxy } = require('http-proxy');
const CLIENT_ID = '78jexcndblghpj';
const REDIRECT_URI = 'http%3A%2F%2Flocalhost%3A8080%2Flogin';

const oauthController = {};
// TODO: Refactor this route to use our NODE_ENV to point to localhost:3000 if production and 8080 if dev. Then switch localhost:3000 again once we get the site hosted.
// TODO: Make actual error handling
// TODO (stretch feature, to prevent CSRF attacks, which don't matter on our site, since a malicious actor can't do anything except mess with the user profile a bit): Generate unique state and store it in use cookies. https://auth0.com/docs/secure/attack-protection/state-parameters

// run function to authenticate user in the database before fulfilling their request
oauthController.authenticate = async (req, res, next) => {
  try {
    console.log('hello from oauthController.authenticate!');

    const text = `SELECT * FROM residents WHERE id='${req.cookies.userId}' AND access_token=${req.cookies.access_token}`;
    const result = await db.query(text);
    console.log('result from query:', result);

    next();
  } catch (error) {
    console.log('error caught in oauthController.authenticate:', error);
    next(error);
  }
}

// exchanges our authentication token for an access token
oauthController.exchangeCode = async (req, res, next) => {
  try {
    console.log('hello from inside oauthController exchangeCode!');

    if (Object.keys(req.cookies).length !== 0) {
      console.log('more than one cookie exists on the request object');
      console.log('req.cookies:', req.cookies);
      const text = `SELECT * FROM residents WHERE id='${req.cookies.userId}' AND access_token='${req.cookies.access_token}'`;
      const verifiedUser = await db.query(text);
      console.log('verifiedUser length:', verifiedUser.rows.length);

      if (verifiedUser.rows.length) {
        console.log('User is verified! We don\'t want to call the LinkedIn API. Calling next() instead...');
        return next();
      } else {
        throw new Error('User is not verified.');
      }
    }
    

    // else, let's make an authorization token and then swap it for an access token!

    const authorizationToken = req.query.code;
    console.log('authorization token', authorizationToken);
    console.log('req.cookies.linkedInAuthCode', req.cookies.linkedInAuthCode);
    const authCode = authorizationToken || req.cookies.linkedInAuthCode;
    console.log('MAKING A FETCH CALL TO LINKEDIN API FROM EXCHANGECODE');
    const URL = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${authCode}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}`;
    // console.log('API URL:', URL);
    const response = await fetch(URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
    const accessToken = await response.json();
    console.log('accessToken: ', accessToken); // { 'access_token': <random long string> }
    
    // ==== INSIDE oauthController.exchangeCode FUNC ====
    // check accessToken object to see if the promise accessToken.json() returned was fulfilled or rejected
    // if the promise was rejected, the accessToken object should have an error property
    if (!accessToken.access_token) { // if the accessToken object's error property exists
      console.log('accessToken error: ', accessToken.error);
      throw new Error(accessToken.error); // throw new Error instance to stop rest of try block code from running
    }

    // the rest of this code shouldn't run if the promise was rejected / an error was thrown

    res.locals.accessToken = accessToken.access_token;

    // if accessToken is defined, set response cookie to value of accessToken, else set response cookie to value of authorizationToken
    // accessToken.access_token ? res.cookie('linkedInAuthCode', accessToken.access_token) : res.cookie('linkedInAuthCode', authorizationToken);
    res.cookie('linkedInAuthCode', authorizationToken);
    res.cookie('access_token', accessToken.access_token);

    console.log('in exchangeCode, just finished setting auth token and access token cookies, about to execute next()');
    return next();
  } 
  catch(err) {
    // an error was thrown in the try block (accessToken.json() resulted in a rejected promise)
    // persist our err object into the next function in our middleware chain
    return next(err);
  }
};

oauthController.callMeAPI = async (req, res, next) => {
  console.log('hello from oauthController.js callMeAPI!');
  console.log('res.locals.accessToken in callMeAPI', res.locals.accessToken);
  try {
    const result = await fetch(
      'https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: 'Bearer ' + res.locals.accessToken
          // Authorization: 'Bearer ' + req.cookies.access_token
        }
      }
    );
    const parsedResult = await result.json();
    res.locals.name = parsedResult.localizedFirstName + ' ' + parsedResult.localizedLastName;
    console.log('me API call result');
    console.log(parsedResult);
    return next();
  }
  catch(err) {
    return next(err);
  }
};

oauthController.callEmailAPI = async (req, res, next) => {
  console.log('hello from oauthController.js callEmailAPI!');
  try {
    const result = await fetch(
      'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: {
          Authorization: 'Bearer ' + res.locals.accessToken
        }
      }
    );
    const parsedResult = await result.json();
    // console.log('email API call result');
    // console.log(parsedResult.elements[0]['handle~']);
    res.locals.email = parsedResult.elements[0]['handle~'].emailAddress;
    return next();
  }
  catch(err) {
    return next(err);
  }
};

oauthController.userComplete = async (req, res, next) => {
  console.log('hello from oauthController.js userComplete!');
  const text = `SELECT cohort FROM residents WHERE id=${req.cookies.userId} AND cohort=''`;
  try {
    let complete = await db.query(text);
    console.log('complete rows length: ', complete.rows.length);
    // what is this? why are we checking this conditional?
    if (complete.rows.length > 0) {
      console.log('complete.rows.length > 0:', complete.rows.length > 0, 'complete.rows: ', complete.rows);
      complete = true
    } else {
      console.log('complete.rows.length > 0:', complete.rows.length > 0, 'complete.rows: ', complete.rows);
      complete = false;
    }
    res.locals.complete = complete;
    return next();
  } catch (err) {
    return next({
        log: 'Error caught in userComplete',
        errorMsg: err
    });
  }
};
// handle getting basic profile info
// GET https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))

module.exports = oauthController;