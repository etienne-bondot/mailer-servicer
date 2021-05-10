import 'dotenv/config';

import Mailer from '../src/services/mailer';

// given
const name = 'Username';
const link = 'http://localhost:8080/testing';
const token = 'fake-token';
const templates = {
  'testing-template': {
    subject: 'Testing purpose',
    data: {name, link, token},
  },
};

const mailer = new Mailer({
  provider: 'gmail',
});

async function testTemplate() {
  // when
  const templateNames = Object.keys(templates);
  templateNames.forEach(async (templateName) => {
    try {
      const res = await mailer.send({
        subject: templates[templateName].subject,
        to: 'test@fakeaddress.com',
        template: templateName,
        data: templates[templateName].data,
      });
      // then
      if (res.success) {
        console.log('Email send!');
      } else {
        console.log(`ERROR`, res.message);
      }
    } catch (error) {
      console.log(`ERROR`, error);
    }
  });
}

testTemplate();
