db = db.getSiblingDB('esp_monitor');
db.createCollection('users');
db.createCollection('devices');
db.createCollection('sensorreadings');
db.createCollection('dashboardlayouts');
print('ESP Monitor database initialized');
