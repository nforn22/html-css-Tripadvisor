const express = require("express");
const cors = require("cors");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// CONFIGURATION MAILERSEND
// 1ER ETAPE IDENTIFICATION
const mailersend = new MailerSend({
  apiKey: process.env.API_KEY
});

const sentFrom = new Sender(
  `MS_CHw6gS${process.env.DOMAIN}`,
  "nforn"
);

app.get("/", (req, res) => {
  res.status(200).json("Server is up !");
});

app.post("/", async (req, res) => {
  try {
    console.log(req.body);

    const { firstname, lastname, email, message } = req.body;

    // on va créer un tableau contenant les infos du destinataire
    const recipients = [new Recipient(email, `${firstname} ${lastname}`)];
    // on configure le mail ✅

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Ceci est un mail de test")
      .setHtml("<p>" + message + "</p>")
      .setText(message);

    // on envoie le mail !

    const result = await mailersend.email.send(emailParams);

    console.log(result);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is started ! 📧");
});
