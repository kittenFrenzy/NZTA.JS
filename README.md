# NZTA.JS

This is a simple nodejs app for easily retrieving open bookings from the NZTA online drivers licence test api.
In order to use this app the following are needed:

- NZ Drivers licence (Any Type)
- Node.JS
- Twilio Account (optional)
- Sendgrid Account (optional)

## Quickstart

1. Install Dependencies

```bash
npm i
or
yarn
```

2. Create .env file in project and add credentials

```properties
#.env
# required
LICENCE_CODE=""
LICENCE_VERSION=""
LAST_NAME=""
# format dd-mm-yyyy eg.. 01-01-2001
DOB=""
#licence class is on the back of your licence
LICENCE_CLASS="1R"
#test site id
SITE_ID=""
#format dd/mm/yyyy
DATE_FROM=""
DATE_TO=""
# not required
API_REFER="[api referrer]",
SG_KEY = ""
AlERT_TO=""
ALERT_FROM=""
TWILIO_SID=""
TWILIO_TOKEN=""
WHATSAPP_TO=""
WHATSAPP_FROM=""
```

3. Edit hosts

- On windows(
  in admin powershell
  )

```powershell
notepad.exe C:\Windows\System32\Drivers\etc\hosts
```

append "127.0.0.1 gen.nzta.govt.nz" to the end of the file and save

- On linux open /etc/hosts and append text above

4. Run

```bash
node find.js
>>> http://127.0.0.1:6677
```

open browser and visit gen.nzta.govt.nz:6677, complete the capthca and the program will log you in with the set credentials,
check console for request successful message
