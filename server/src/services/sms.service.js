const axios = require("axios");

const sendSms = async (phone, otp) => {
    try {
        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                variables_values: otp,
                route: "otp",
                numbers: phone
            },
            {
                headers: {
                    authorization: process.env.FAST2SMS_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("response.data :",response.data)

        return response.data;

    } catch (error) {
        console.error(
            "SMS sending error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

module.exports = {
    sendSms
};