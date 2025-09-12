let sessionExpirySetter = null;

export const setSessionExpiryManager = (setterFxn) => {
  sessionExpirySetter = setterFxn;
};

export const triggerSessionExpiry = () => {
  if (sessionExpirySetter) {
    sessionExpirySetter(true);
  } else {
    console.log("Session Expiry Handler not set yet!.");
  }
};
