const axios = require('axios');


const reCaptchaV3Verify = async (idToken) => {

    try {
        const resp = await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_V3_SECRET_KEY}&response=${idToken}`);

        const { success, challenge_ts, hostname, score } = resp.data;
        return { success, challenge_ts, hostname, score };

    } catch (err) {
        return console.error(err);
    }

}


module.exports = {
    reCaptchaV3Verify
}