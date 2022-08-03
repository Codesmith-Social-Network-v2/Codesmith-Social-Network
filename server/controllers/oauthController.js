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
    next();
  } catch (error) {
    console.log('error caught in oauthController.authenticate:', error);
    next(error);
  }
}

oauthController.exchangeCode = async (req, res, next) => {
  try {
    console.log('inside oauthController exchange code');
    // console.log('logging req.cookies: ', req.cookies, ' end of req.cookies object');
    const authCode = req.query.code || req.cookies.linkedInAuthCode;
    console.log('MAKING A FETCH CALL TO LINKEDIN API FROM EXCHANGECODE');
    const accessToken = await fetch(
      `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${authCode}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
    const response = await accessToken.json();
    console.log('Response: ', response); // { 'access_token': <random long string> }
    
    // ==== INSIDE oauthController.exchangeCode FUNC ====
    // check response object to see if the promise accessToken.json() returned was fulfilled or rejected
    // if the promise was rejected, the response object should have an error property
    if (response.error) { // if the response object's error property exists
      console.log('response error: ', response.error);
      throw new Error(response.error); // throw new Error instance to stop rest of try block code from running
    }

    // the rest of this code shouldn't run if the promise was rejected / an error was thrown
    res.locals.accessToken = response.access_token;

    res.cookie('linkedInAuthCode', authCode);
    console.log('in exchangeCode, about to execute next()');
    return next();
  } 
  catch(err) {
    // an error was thrown in the try block (accessToken.json() resulted in a rejected promise)
    // persist our err object into the next function in our middleware chain
    return next(err);
  }
};

oauthController.callMeAPI = async (req, res, next) => {
  try {
    const result = await fetch(
      'https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: 'Bearer ' + res.locals.accessToken
        }
      }
    );
    const parsedResult = await result.json();
    res.locals.name = parsedResult.localizedFirstName + ' ' + parsedResult.localizedLastName;
    // console.log('me API call result');
    // console.log(parsedResult);
    return next();
  }
  catch(err) {
    return next(err);
  }
};

oauthController.callEmailAPI = async (req, res, next) => {
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
  const text = `SELECT cohort FROM residents WHERE id=${req.cookies.userId} AND cohort=''`;
  try {
    let complete = await db.query(text);

    // what is this? why are we checking this conditional?
    if (complete.rows.length === 0) {
      console.log('complete.rows.length === 0:', complete.rows.length === 0, 'complete.rows: ', complete.rows);
      complete = true
    } else {
      console.log('complete.rows.length === 0:', complete.rows.length === 0, 'complete.rows: ', complete.rows);
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