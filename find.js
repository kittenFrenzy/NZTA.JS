const fetch = require("node-fetch")
const token_capture = require("./server")
let AppCookies = ""
const run_interval = 20000
const { send_email, send_whatsapp } = require("./alerts")
require("dotenv").config()

const request = () => {
  fetch(process.env.API_FETCH, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-NZ,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
      "api-version": "1.0",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      cookie: AppCookies,
    },
    referrer: process.env.API_REFER,
    referrerPolicy: "same-origin",
    body: null,
    method: "GET",
    mode: "cors",
  })
    .then(r => r.json())
    .then(x => {
      if (x.slotAvailability) console.log("request successful")
      if (x.slotAvailability[0]) {
        send_email(
          "slot available!",
          `Slot times: ${JSON.stringify(x.slotAvailability)}`
        )
        send_whatsapp(`Slot times: ${JSON.stringify(x.slotAvailability)}`)
        console.log(x.slotAvailability)
      }
    })
    .catch(auth_err)
}

const auth_err = async err => {
  console.log(err)
  console.log("please complete captcha")
  clearInterval(timer_id)
  await send_email("Api Error", err.toString())
  await send_whatsapp(err.toString())
  return
}

const setter = cookie => {
  AppCookies = cookie
  clearInterval(timer_id)
  timer_id = setInterval(request, run_interval)
  request()
}

let timer_id = setInterval(request, run_interval)
request()

token_capture(setter)
