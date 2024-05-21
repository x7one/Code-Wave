require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const bodyParser = require('body-parser');

const domain = process.env.DOMAIN;
const ownMail = process.env.EMAIL;
const ownMailPass = process.env.EPASSWORD;

const app = express();

const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const fs = require('fs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const secretKey = 'gfdgr';
const interval = 24 * 60 * 60 * 1000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.post('/api/feedback', async (req, res) => {
    try {
        if (!req.body || !req.body.name || !req.body.phone || !req.body.email) {
            return res.status(400).send('Invalid request. Missing required fields.');
        }
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: `${ownMail}`,
                pass: `${ownMailPass}`,
            },
        });
        const { name, phone, email } = req.body;
        const feedback = await prisma.feedbackModel.create({
            data: {
                name,
                phone,
                email,
            },
        });

        await transporter.sendMail({
            from: `ООО 'Code-Wave' <${ownMail}>`,
            to: `${ownMail}`,
            subject: `Новая заявка`,
            text: email,
            html: `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Новая заявка</title>
          <style>
              * {
                  padding: 0;
                  margin: 0;
              }
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
              }
              h2 {
                  color: #007bff;
              }
              p{
                color: #000;
             }
             table {
              width: 300px;
              border-collapse: collapse;
               }
              td, th {
                  padding: 3px;
                  border: 1px solid black;
              }
              th {
                  background: #b0e0e6;
              }
          </style>
      </head>
      <body>

          <div class="container">
              <h1>Новая заявка</h1>
          <table>
          <tbody>
              <tr>
                  <td>Имя:</td>
                  <td> ${name}</td>
              </tr>
              <tr>
                  <td>Телефон: </td>
                  <td> ${phone}</td>
              </tr>
              <tr>
                  <td> Почта: </td>
                  <td> ${email}</td>
              </tr>
          </tbody>
         </table>
          </div>
      </body>
      </html>
        `,

        });
        await transporter.sendMail({
            from: `ООО 'Code-Wave' <${ownMail}>`,
            to: email,
            subject: `Вы оставили заявку`,
            text: email,
            html: `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ответ на вашу заявку</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
              }
              h2 {
                  color: #007bff;
              }
              p{
                color: #000;
             }
          </style>
      </head>
      <body>
          <div class="container">
            <h2>Вы оставили заявку</h2>
            <p>Здравствуйте, <strong> ${name}</strong>!</p>
            <p>Благодарим вас за обращение в нашу компанию. Мы получили вашу заявку и скоро свяжемся с вами.</p>
            <p>Ниже приведена информация о вашей заявке:</p>
            <ul>
                <li><strong>Имя:</strong> ${name}</li>
                <li><strong>Телефон:</strong> ${phone}}</li>
                <li><strong>Email:</strong> ${email}</li>
            </ul>
              <p>С уважением,<br>Команда Code-Wave</p>
          </div>
      </body>
      </html>
        `,
        })
        return res.status(200).json({ status: 200, message: "Success" });
    } catch (e) {
        console.error("Error:", e);
        return res
            .status(500)
            .send({ status: 500, message: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log('server start')
});