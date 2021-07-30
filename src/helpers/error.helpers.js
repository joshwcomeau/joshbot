import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
});

export const resetScope = () => {
  Sentry.configureScope((scope) => scope.clear());
};

export const captureUserForLogs = (user) => {
  // Hm, this doesn't SEEM to work—users aren't added to errors.
  // But I don't NEED this info right now, so I'm letting it go.
  return Sentry.setUser(user);
};

export const generateBreadcrumbFunction =
  (category) =>
  ({ level = Sentry.Severity.Info, message }) =>
    Sentry.addBreadcrumb({
      category,
      message,
      level,
    });

export function trackEvent(name) {
  const transaction = Sentry.startTransaction({ name });

  return [
    async (err, metadata) => {
      Sentry.captureException(err, { contexts: metadata });
    },
    async () => {
      transaction.finish();
    },
  ];
}

// To avoid eating my sentry bandwidth, stub out so that it has no
// effect
// if (process.env.NODE_ENV !== 'production') {
//   Sentry.startTransaction = () => ({
//     finish: () => {},
//   });
//   Sentry.captureException = () => {};
// }
