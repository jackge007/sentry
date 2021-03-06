import SentryAppInstallationStore from 'app/stores/sentryAppInstallationsStore';
import SentryAppStore from 'app/stores/sentryAppStore';

const fetchSentryAppInstallations = (api, orgSlug) => {
  const sentryAppsUri = '/sentry-apps/';
  const installsUri = `/organizations/${orgSlug}/sentry-app-installations/`;

  function updateSentryAppStore(sentryApps) {
    SentryAppStore.load(sentryApps);
  }

  function fetchInstalls() {
    api
      .requestPromise(installsUri)
      .then(installs => installs.map(setSentryApp))
      .then(updateInstallStore);
  }

  function setSentryApp(install) {
    install.sentryApp = SentryAppStore.get(install.app.slug);
    return install;
  }

  function updateInstallStore(installs) {
    SentryAppInstallationStore.load(installs);
  }

  api
    .requestPromise(sentryAppsUri)
    .then(updateSentryAppStore)
    .then(fetchInstalls);
};

export default fetchSentryAppInstallations;
