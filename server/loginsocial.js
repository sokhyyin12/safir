ServiceConfiguration.configurations.remove({
	service: 'twitter'
});
ServiceConfiguration.configurations.insert({
	service: "twitter",
	consumerKey: "6G1u7JE3ycr18pqYOMrr5kp28",
	secret: "KfKJvKF3wNuWTRv1FLPMv8mj4QSdt1oMBetlIOL5sjG0mXM5km"
});
 // for facebook login
ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
 
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '1546488668995009',
    secret: '80b8fda10a3d1c096227016efc487af3'
});
// for google
ServiceConfiguration.configurations.remove({
  service: "google"
});
ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: "413876591312-2gq5v1gc5cjua8u2cp989sek2nikkiev.apps.googleusercontent.com",
  secret: "OyJaFYslWNMkPCpOxODDagEI"
});

//for instagram
ServiceConfiguration.configurations.remove({
    service: 'instagram'
});
ServiceConfiguration.configurations.insert({
    service: 'instagram',
    scope: 'basic',
    clientId: 'caae57321d9d4caebe30530029d3aa56',
    secret: '5b1a3728abd94f8b9ff812f1eb61d9b9'
});

