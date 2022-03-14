const nodemailer = require('nodemailer')
const { google } = require('googleapis')
require('dotenv').config()

class EmailSender {
  static config () {
    var oAuthClient = new google.auth.OAuth2(
      process.env.G_CLIENT_ID,
      process.env.G_CLIENT_SECRET,
      process.env.G_REDIRECT_URI
    )
    oAuthClient.setCredentials({ refresh_token: process.env.G_REFRESH_TOKEN })
    return oAuthClient
  }

  static getMailTransportObject (accessToken) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.G_AUTH_EMAIL_USER,
        clientId: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_CLIENT_SECRET,
        refreshToken: process.env.G_REFRESH_TOKEN,
        accessToken: accessToken
      }
    })
  }

  static getMailTransportOptions (to_emails, verificationLink) {
    return {
      from: `"SAN PEDRO SYSTEM ONLINE" <noreply:${process.env.G_AUTH_EMAIL_USER}>`,
      to: to_emails.join(', '),
      subject: 'ACCOUNT EMAIL VERIFICATION',
      text: `Please verify your email address by going to this link: ${verificationLink}`,
      html: `<!doctype html>
      <html lang="en">
      
      <head>
          <!-- Required meta tags -->
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <!-- Bootstrap CSS -->
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
              integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
      
          <title>Hello, world!</title>
      </head>
      
      <body>
          <div class="container">
              <div class="vstack">
                  <img src="cid:banner-h" />
              </div>
              <div class="modal-body d-sm-flex justify-content-center">
                  <h1 class="h3 fw-bold mt-3 text text-center" style="color: green;">Click the button below to verify your
                      account</h1>
              </div>
              <div class="w-100 mt-3">
                  <form class="d-block text-center vstack" action="localhost:3000/admin">
                      <button class="btn btn-success w-25" type="submit">
                          <div>Verify Now</div>
                      </button>
                  </form>
              </div>
              <div class="vstack mt-4">
                  <img src="cid:banner-f" />
              </div>
          </div>
          <!-- Option 1: Bootstrap Bundle with Popper -->
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
              integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
              crossorigin="anonymous"></script>
      </body>
      
      </html>`,
      attachments: [
        {
          filename: 'email_banner_header.png',
          path: './frontend/static/img/email_banner.png',
          cid: 'banner-h' //same cid value as in the html img src
        },
{
          filename: 'email_banner_footer.png',
          path: './frontend/static/img/email_banner_footer.png',
          cid: 'banner-f' //same cid value as in the html img src
        },

      ]
    }
  }

  static async sendEmail (to_email, oAuthClient) {
    try {
      // get access token from oauth client
      const accessTokenGen = await oAuthClient.getAccessToken()
      // nodemailer transport
      const mailTransport = EmailSender.getMailTransportObject(accessTokenGen)
      //send an email
      const result = await mailTransport.sendMail(
        EmailSender.getMailTransportOptions(
          to_email,
          'localhost:3000/?' // < temporary
        )
      )
      console.log(result)
      return result
    } catch (error) {
      console.log(error)
      return error
    }
  }
}

module.exports = EmailSender
