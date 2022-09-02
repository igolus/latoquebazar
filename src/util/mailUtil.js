import {getActivationEmailLinkUrl, getResetAccountLinkUrl, sendEmailUrl} from "../conf/configUtil";

const config = require('../conf/config.json')

export const getResetMailLink = async (email) => {
    const token = localStorage.getItem('authToken');

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: token ? `Bearer ${token}` : ""
      },

    };

    let response = await fetch(
        getResetAccountLinkUrl() + "?email=" + email,
        requestOptions);
    let resJson;
    try {
      resJson = await response.json();
    }
    catch (error) {
      return null;
    }
    return resJson.link;
}

export const getActivationMailLink = async (email) => {
  const token = localStorage.getItem('authToken');

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: token ? `Bearer ${token}` : ""
    },

  };

  let response = await fetch(
      getActivationEmailLinkUrl() + "?email=" + email,
      requestOptions);
  let resJson;
  try {
    resJson = await response.json();
  }
  catch (error) {
    return null;
  }
  return resJson.link;
}

export const sendMailMessage = async (currentBrand, currentEstablishment, content, subject, targetEmail) => {

  if (currentBrand.config && currentBrand.config.notifEmailConfig) {
    let confMail = currentBrand.config.notifEmailConfig;
    let logo = currentBrand.logoUrl;
    //alert("logo " + logo);
    //let footer = confMail.footer;
    let fromEmail = confMail.fromEmail;
    let title = title;
    let establishmentName = currentEstablishment.establishmentName;

    const token = localStorage.getItem('authToken');

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({
        content: content,
        //footer: footer,
        subject: subject,
        title: title,
        from: fromEmail,
        logo:logo,
        fromName: establishmentName,
        targetEmail: targetEmail
      })
    };

    let response = await fetch(
      sendEmailUrl() + "/message/" + currentBrand.id +
      "/" + currentEstablishment.id,
      requestOptions);
    let resJson;
    try {
      resJson = await response.json();
    }
    catch (error) {
      return null;
    }
    return resJson;
  }
  return null;
}
