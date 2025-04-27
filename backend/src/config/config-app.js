export default {
    routesNoAuth: [
      '/api/login',
      '/api/public/info',
      '/api/register',
      '/api/forgot-password'
    ],
    featureFlags: {
      enableSomeFeature: true,
      enableMatchingEngine: true,
      enableWebsocketUpdates: true
    },
    customSettings: {
        appName: 'Bitcoin Exchange Platform',
        supportEmail: 'support@example.com',
    }
  };
