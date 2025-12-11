import React from "react";
import { decodeToken } from "react-jwt";

export const TOKEN_KEY = "iszkQAdmin@makeite.com";
export const TOKEN_KEY_REFRESH = "iszkQRefresh@makeite.com";
const TOKEN_KEY_USER = "isckUser@makeite.com34r";
const INSIGHT_KEY = "makeite.comInsight@keyNew891";

export const userDetails = () => {
  // console.info("get  store details....");
  const token = localStorage.getItem(TOKEN_KEY);
  // console.log("token", decodeToken(token));
  if (token) {
    //  console.log(decodeToken(token));
    const decodedJwt = parseJwt(token);
    // console.info("decodedJwt", decodedJwt &&decodedJwt.exp * 1000 < Date.now());
    if (decodedJwt && decodedJwt.exp * 1000 < Date.now()) {
      return false;
    }
    return decodeToken(token);
  } else {
    console.info("store  details not found....");
    return false;
  }
};

export const newsUserDetails = () => {
  // console.info("get  store details....");
  const token = localStorage.getItem(TOKEN_KEY_USER);
  // console.log("token", decodeToken(token));
  if (token) {
    return decodeToken(token);
  } else {
    console.info("store  details not found....");
    return false;
  }
};

export const login = (token, refresh_token) => {
  return new Promise((resolve, reject) => {
    try {
      // Store the token in localStorage
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_KEY_REFRESH, refresh_token);

      // Resolve the promise successfully
      resolve();
    } catch (error) {
      // Reject the promise if an error occurs
      reject(error);
    }
  });
};

export const setAdsSession = (token) => {
  localStorage.setItem(TOKEN_KEY_REFRESH, token);
};

export const setUserSession = (token) => {
  localStorage.setItem(TOKEN_KEY_USER, token);
};

export const getToken = () => {
  // console.log('get token....');
  return localStorage.getItem(TOKEN_KEY);
};

export const getTokenRefresh = () => {
  // console.log('get token....');
  return localStorage.getItem(TOKEN_KEY_REFRESH);
};

export const getTokenUser = () => {
  // console.log('get token....');
  return localStorage.getItem(TOKEN_KEY_USER);
};

export const userLogOut = () => {
  console.log("remove token....");
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY_REFRESH);
  return true;
};

export const isLogin = () => {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    console.error("User cannot access main console: token not found");
    return false;
  }
  console.warn("isLogin_token", token);
  const decodedJwt = parseJwt(token);
  console.info("decodedJwt", decodedJwt && decodedJwt.exp * 1000 < Date.now());
  const expiered = decodedJwt && decodedJwt.exp * 1000 < Date.now();

  if (token && !expiered) {
    let decode = decodeToken(token);
    console.log("access main console : welcome");
    return true;
  } else {
    console.error("User cant be access main console : token not found");
    return false;
  }
};

export const isLoginAds = () => {
  let token = localStorage.getItem(TOKEN_KEY_REFRESH);
  console.warn("token::", token);
  if (!token) {
    console.error("User cannot access main console: token not found");
    return false;
  }
  console.warn("isLogin_token", token);
  const decodedJwt = parseJwt(token);
  console.info("decodedJwt", decodedJwt && decodedJwt.exp * 1000 < Date.now());
  const expiered = decodedJwt && decodedJwt.exp * 1000 < Date.now();
  console.warn("isLogin_expiered", expiered);

  if (token && !expiered) {
    let decode = decodeToken(token);
    console.log("access main console : welcome");
    return true;
  } else {
    console.error("User cant be access main console : token not found");
    return false;
  }
};

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export const decodedToken = async (token) => {
  try {
    if (!token) {
      console.info("Token not provided.");
      return false;
    }

    const decodedJwt = decodeToken(token);

    if (!decodedJwt) {
      console.warn("Invalid token.");
      return false;
    }

    if (decodedJwt.exp * 1000 < Date.now()) {
      console.info("Token has expired.");
      return false;
    }

    return decodedJwt;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const setInsight = (token) => {
  localStorage.setItem(INSIGHT_KEY, token);
};

export const getInsight = async () => {
  // console.log("first_getInsight", null);
  return new Promise((resolve, reject) => {
    try {
      const token = localStorage.getItem(INSIGHT_KEY);
      if (token !== null) {
        // console.log("inner_getInsight", token);
        resolve(decodeToken(token));
      } else {
        console.log("inner_getInsight", "not found");
        reject(false);
      }
    } catch (error) {
      console.log("inner_getInsight", "not found");
      reject(false);
    }
  });
};

export const getInsightToken = () => {
  // console.log('get token....');
  const token = localStorage.getItem(INSIGHT_KEY);
  return token;
};

export const removeInsight = () => {
  console.log("remove Insight token....");
  localStorage.removeItem(INSIGHT_KEY);
  return true;
};
