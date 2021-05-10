import {Mailer} from '../src/services/mailer';

const verbose = false;

const testResponse = (response, data) => {
  expect(response).toHaveProperty('success');
  expect(response.success).toBeTruthy();
  expect(response).toHaveProperty('data');
  expect(response.data).toHaveProperty('message');
  const message = JSON.parse(response.data.message);
  expect(message).toHaveProperty('subject');
  expect(message).toHaveProperty('html');
  expect(message).toHaveProperty('text');
  expect(message.subject).toEqual(data.subject);
  expect(message.html).toMatchSnapshot();
  expect(message.text).toMatchSnapshot();
};

const templates = {
  'testing-template': {
    subject: 'Testing',
    data: {
      link: '/test/link',
      name: 'Username',
      token: 'test_token',
    },
  },
};

const templateNames = Object.keys(templates);

describe('Templates', () => {
  const credentials = {
    username: 'fake@gmail.com',
    clientId: 'fakeClientId',
    clientSecret: 'fakeClientSecret',
    refreshToken: 'fakeRefreshToken',
    accessToken: 'fakeAccessToken',
  };

  for (const templateName of templateNames) {
    const template = templates[templateName];

    it(templateName, async () => {
      // given
      const mailer = new Mailer({
        options: {
          isTesting: true,
          verbose,
        },
        transporterOptions: {
          // @ts-expect-error 'host' does not exist in type 'TransportOptions | Transport'
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          service: 'gmail',
          auth: {
            ...credentials,
            type: 'OAuth2',
            expires: 3599,
          },
        },
      });

      // when
      const res = await mailer.send({
        subject: template.subject,
        to: 'email+test@fakeaddress.com',
        template: templateName,
        data: template.data,
      });

      // then
      testResponse(res, template);
    });
  }
});
