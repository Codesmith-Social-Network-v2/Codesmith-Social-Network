import React, { Component, useState, useEffect } from 'react';
import { HomeContainer } from './HomeContainer.jsx';
import { LandingPage } from '../components/LandingPage.jsx';
import { SetCohort } from '../components/SetCohort.jsx';

export default function MainContainer() {
  const [isAuthenticated, changeAuthenticated] = useState(false);
  const [cohortIsSet, setCohort] = useState(false);
  // const [isComplete, changeComplete] = useState(false);

  if (document.cookie) console.log('document.cookie:', document.cookie); // document.userId, document.linkedInAuthCode
  const getCookie = (cookie) => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(cookie + '='))
      ?.split('=')[1];
  };

  useEffect(() => {
    // On page load, we need to check if linkedInAccessToken and User ID cookies are set
    // if so, we need to redirect to the server to check if the cookie is valid
    // if the cookie is valid, we need to set isAuthenticated to true on the client side
    // if cookie is invalid, clear cookie and redirect back to homepage
    // if cookie is not set, load the landing page
    //Check if cohortIsSet when isAuthenticated is changed to true
    //Fetching to the server, whether user is Authenticated and cohortisset

    if (getCookie('userId') && getCookie('linkedInAuthCode') && getCookie('linkedInAuthCode') !== 'undefined') {
      console.log("found a user ID and auth code, going to verify user (fetching '/verifyuser')");
      // we just want to check if there's a match with getCookie('userId') and database userId
      // AND we want to check if there's a match with getCookie('linkedInAuthCode') and database access_token


      // we might not need to make a GET request to this route
      fetch('http://localhost:8080/verifyuser', {
        credentials: 'same-origin',
      })
      .then(res => res.json())
      .then(res => {
        console.log('res inside fetch call for /verifyuser: ', res);
        if (res.status !== 400) {
          changeAuthenticated(true);

          // // document.cookie.userId is NOT null/undefined, then...
          // fetch('http://localhost:8080/verifyuser/complete')
          // .then(res => {
          //   console.log('res before json()', res);
          //   return res.json();
          // })
          // .then(res => {
          //   console.log('res inside fetch call for /verifyuser/complete');
          //   console.log('res returned from oauthController.userComplete:', res);
            if (res) setCohort(true);
          // });
        }
      });
    } else {
      console.log('user ID and/or auth token not found');
      changeAuthenticated(false);
      // send user to route (via fetch request) that runs through oauthController exchangeCode
    }
    // for calling linkedIn API the second time around
    // if (getCookie('userId')) { // document.cookie.userId is NOT null/undefined, then...
    //   fetch('http://localhost:8080/verifyuser/complete')
    //     .then(res => res.json())
    //     .then(res => {
    //       console.log('res inside fetch call for /verifyuser/complete');
    //       console.log('res returned from oauthController.userComplete:', res);
    //       if (res) setCohort(true);
    //     });
    // }
    console.log('hello at the bottom of MainContainer.jsx!');
    console.log('isAuthenticated', isAuthenticated);
    console.log('cohortIsSet', cohortIsSet);
  });

  return (
    <div className="MainContainer">
      {
        isAuthenticated
          ? cohortIsSet // if isAuthenticated is true, then check if cohortIsSet is true or false
            ? <HomeContainer changeAuthenticated={changeAuthenticated}/> // if cohortIsSet is true, render home page
            : <SetCohort setCohort={setCohort} /> // if cohortIsSet is false, render set cohort page
          : <LandingPage changeAuthenticated={changeAuthenticated} /> // if isAuthenticated is false, render landing page
      }
    </div>
  );
}