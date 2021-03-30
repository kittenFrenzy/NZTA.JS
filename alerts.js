const sgMail = require("@sendgrid/mail")

if (process.env.SG_KEY) sgMail.setApiKey(process.env.SG_KEY)
const send_email = (subject, message) => {
  if (!process.env.SG_KEY) return
  return new Promise((resolve, reject) => {
    const msg = {
      to: process.env.ALERT_TO, // Change to your recipient
      from: process.env.ALERT_FROM, // Change to your verified sender
      subject: subject,
      text: message,
      html: message,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log("email sent")
        resolve("Success")
      })
      .catch(error => {
        // console.error(error.body)
        reject(error)
      })
  })
}
const accountSid = process.env.TWILLO_SID
const authToken = process.env.TWILLO_TOKEN
const client = accountSid ? require("twilio")(accountSid, authToken) : 0

const send_whatsapp = message => {
  if (!client) return
  return new Promise((resolve, reject) => {
    client.messages
      .create({
        body: message,
        from: `whatsapp:${process.env.WHATSAPP_FROM}`,
        to: `whatsapp:${process.env.WHATSAPP_TO}`,
      })
      .then(message => {
        console.log("whatsapp sent")
        resolve("sent")
      })
      .catch(err => reject(err))
  })
}

module.exports = { send_email, send_whatsapp }
