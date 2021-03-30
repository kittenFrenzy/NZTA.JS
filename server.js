const fetch = require("node-fetch")
const ex = setter => {
  const fastify = require("fastify")({})

  const fs = require("fs/promises")

  fastify.get("/", async (request, reply) => {
    let html = await (await fs.readFile("./captcha.html")).toString()
    reply.header("Content-Type", "text/html")
    return html
  })

  fastify.addContentTypeParser(
    "application/x-www-form-urlencoded",
    { parseAs: "string" },
    async function (request, payload) {
      return { [payload.split("=")[0]]: payload.split("=")[1] }
    }
  )

  fastify.post("/", async (request, reply) => {
    try {
      let token = request.body["g-recaptcha-response"]
      let login_reply = await login(token)

      if (!login_reply.ok) throw new Error("problem with token")
      let raw_cookies = login_reply.headers.raw()["set-cookie"]
      setter(await raw_cookies.reduce((x, c) => x + c.split(";")[0] + "; ", ""))
      return "Success"
    } catch (err) {
      console.log(err)
      return err
    }
  })

  const start = async () => {
    try {
      await fastify.listen(6677).then(e => console.log(e))
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()
}

const login = token => {
  return fetch("https://online.nzta.govt.nz/api/authentication", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-NZ,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    referrer: "https://online.nzta.govt.nz/licence-test/identification",
    body: `{"licenceNumber":"${process.env.LICENCE_CODE}","licenceVersion":"${process.env.LICENCE_VERSION}","lastName":"${process.env.LAST_NAME}","dateOfBirth":"${process.env.DOB}","reCaptchaToken":"${token}"}`,
    method: "POST",
    mode: "cors",
  })
}

module.exports = ex
