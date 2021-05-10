import emailTemplate from 'email-templates';
import nodemailer, {Transporter, Transport, TransportOptions} from 'nodemailer';

import {Options} from '~/types';

type Provider = 'gmail';

export class Mailer {
  // Services
  transporter: Transporter;
  mailer: emailTemplate;

  // Options
  options: Options;

  constructor({
    provider,
    options,
    transporterOptions,
  }: {
    provider?: Provider;
    options?: Options;
    transporterOptions?: TransportOptions;
  }) {
    this.options = {
      isTesting: false,
      verbose: true,
      ...options,
    };

    function getTransporter(provider?: Provider): TransportOptions | Transport {
      switch (provider) {
        case 'gmail':
        default:
          return {
            // @ts-expect-error 'host' does not exist in type 'TransportOptions | Transport'
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.GMAIL_USERNAME,
              clientId: process.env.OAUTH_CLIENT_ID,
              clientSecret: process.env.OAUTH_CLIENT_SECRET,
              refreshToken: process.env.OAUTH_REFRESH_TOKEN,
              accessToken: process.env.OAUTH_ACCESS_TOKEN,
              expires: 3599,
            },
          };
      }
    }

    this.transporter = nodemailer.createTransport(transporterOptions || getTransporter(provider));

    this.mailer = new emailTemplate({
      send: true,
      preview: false,
      views: {root: './emails'},
      transport: this.options.isTesting ? {jsonTransport: true} : this.transporter,
    });
  }

  async send({
    subject,
    to,
    template,
    data,
  }: {
    subject: string;
    to: string;
    template: string;
    data?: {[key: string]: string | number};
  }): Promise<{message?: string; data?: {[key: string]: unknown}; success: boolean}> {
    try {
      const response = await this.mailer.send({
        template,
        message: {
          subject,
          to,
        },
        locals: data || {},
      });

      if (this.options.verbose) {
        console.log({data: response});
      }
      return {data: response, success: true};
    } catch (err) {
      if (this.options.verbose) {
        console.error(err);
      }
      return {message: err, success: false};
    }
  }
}

let mailer;
const provider = process.env.PROVIDER;

try {
  if (!provider) {
    throw new Error(
      'No provider set - add PROVIDER=<your_provider> to the .env file (actual providers supported: "gmail")'
    );
  } else {
    console.log(`Setting new provider: ${provider}`);
    mailer = new Mailer({provider: provider as Provider});
  }
} catch (error) {
  console.error(error);
}

export {mailer};

export default Mailer;
