const en = {
  // ── Common ──────────────────────────────
  appName: 'ESP_MONITOR',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  done: 'Done',
  back: 'Back',
  next: 'Next',
  open: 'Open',
  retry: 'Retry',
  copy: 'Copy',
  unknownDevice: 'Unknown Device',
  close: 'Close',
  loading: 'Loading…',
  saving: 'Saving…',
  unsaved: 'Unsaved',
  connected: 'Connected',
  disconnected: 'Disconnected',
  online: 'Online',
  offline: 'Offline',
  noDataYet: 'No data yet',

  // ── Nav ─────────────────────────────────
  nav: {
    navigation: 'Navigation',
    devices: 'Devices',
    dashboard: 'Dashboard',
    guide: 'Guide',
    logout: 'Logout',
  },

  // ── Auth ────────────────────────────────
  login: {
    tagline: 'IOT PLATFORM',
    headline: 'MONITOR\nYOUR ESP32\nLIVE',
    subtext: 'Real-time sensor dashboards for your IoT fleet. Sub-100ms latency.',
    stats: {
      latency: 'LATENCY',
      protocol: 'PROTOCOL',
      widgets: 'WIDGETS',
    },
    title: 'Welcome back',
    subtitle: 'Sign in to your dashboard',
    emailLabel: 'EMAIL ADDRESS',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'PASSWORD',
    passwordPlaceholder: 'Enter your password',
    submit: 'SIGN IN',
    error: 'Invalid email or password',
    noAccount: 'No account yet?',
    createOne: 'Create one',
  },

  register: {
    tagline: 'GET STARTED FREE',
    headline: 'START\nMONITORING\nTODAY',
    subtext: 'Register, flash your ESP32, and see live sensor data in minutes.',
    features: [
      'Real-time MQTT data ingestion',
      'Drag-and-drop widget dashboard',
      'HC-SR04, TCS230 & custom sensors',
    ],
    title: 'Create account',
    subtitle: 'Start monitoring your IoT devices',
    emailLabel: 'EMAIL ADDRESS',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'PASSWORD',
    passwordPlaceholder: 'Minimum 6 characters',
    confirmLabel: 'CONFIRM PASSWORD',
    confirmPlaceholder: 'Repeat your password',
    submit: 'CREATE ACCOUNT',
    errorMismatch: 'Passwords do not match',
    errorShort: 'Password must be at least 6 characters',
    hasAccount: 'Already have an account?',
    signIn: 'Sign in',
  },

  // ── Devices ─────────────────────────────
  devices: {
    title: 'Devices',
    countSingular: '1 device registered',
    countPlural: (n: number) => `${n} devices registered`,
    addDevice: 'Add Device',
    noDevices: 'No devices yet',
    noDevicesHint: 'Add your first ESP32 device to start monitoring',
    openDashboard: 'Open',
    regenTooltip: 'Regenerate credentials',
    lastSeen: 'last seen',

    addModal: {
      title: 'ADD NEW DEVICE',
      hint: "Give your ESP32 device a recognizable name. You'll receive MQTT credentials after creation.",
      nameLabel: 'DEVICE NAME',
      namePlaceholder: 'e.g. Greenhouse Node 1',
      submit: 'CREATE DEVICE',
    },

    credsModal: {
      title: 'DEVICE CREDENTIALS',
      warning: 'Save these credentials now',
      warningHint: 'The MQTT password will never be shown again. Copy it to your ESP32 firmware before closing.',
      deviceId: 'DEVICE ID',
      mqttUsername: 'MQTT USERNAME',
      mqttPassword: 'MQTT PASSWORD',
      mqttTopic: 'MQTT TOPIC',
      apiKey: 'API KEY',
      quickStart: 'ARDUINO / ESP32 QUICK START',
      quickStartDesc: 'WiFi → MQTT.connect(username, password) → publish to topic',
      goToDashboard: 'GO TO DASHBOARD',
    },

    regenModal: {
      title: 'REGENERATE CREDENTIALS',
      warning: 'This will invalidate the current MQTT password and API key. Your ESP32 will disconnect until you flash the new credentials.',
      submit: 'REGENERATE',
    },

    regenResultModal: {
      title: 'NEW CREDENTIALS',
      warning: 'New MQTT password shown once only. Update your ESP32 firmware now.',
      done: 'DONE',
    },

    deleteModal: {
      title: 'DELETE DEVICE',
      warning: 'This will permanently delete the device and all its sensor history. This action cannot be undone.',
      submit: 'DELETE',
    },

    toast: {
      created: 'Device created',
      deleted: 'Device deleted',
      createFailed: 'Failed to create device',
      deleteFailed: 'Failed to delete device',
      regenFailed: 'Failed to regenerate credentials',
    },
  },

  // ── Dashboard ───────────────────────────
  dashboard: {
    noDevice: 'No device selected',
    noDeviceHint: 'Choose a device to view its dashboard',
    goToDevices: 'GO TO DEVICES',
    editMode: 'EDIT MODE — DRAG TO REPOSITION · RESIZE FROM CORNER · CLICK × TO REMOVE',
    edit: 'EDIT',
    addWidget: 'ADD WIDGET',
    noWidgets: 'NO WIDGETS CONFIGURED',
    noWidgetsHint: 'Choose which sensors and controls you want to monitor on this device.',
    addFirstWidget: 'ADD FIRST WIDGET',
    saveFailed: 'Failed to save dashboard layout',
  },

  // ── Widgets ─────────────────────────────
  widgets: {
    live: 'LIVE',
    idle: 'IDLE',
    rising: 'RISING',
    falling: 'FALLING',
    stable: 'STABLE',
    awaitingData: 'AWAITING DATA',
    error: 'WIDGET ERROR',
    tryAgain: 'TRY AGAIN',
    tcs230Label: 'TCS230 COLOR SENSOR',
  },

  // ── Add Widget Modal ─────────────────────
  addWidget: {
    titleStep: (step: number) => `ADD WIDGET — STEP ${step} / 3`,
    selectSensor: 'Select Sensor',
    customSensorLabel: 'CUSTOM SENSOR TYPE',
    customSensorPlaceholder: 'e.g. dht22_temp',
    noConfigNeeded: 'NO CONFIGURATION NEEDED',
    addWidget: 'ADD WIDGET',
    minLabel: 'MIN',
    maxLabel: 'MAX',
    unitLabel: 'UNIT',
    unitPlaceholder: 'cm · °C · % ...',
    labelLabel: 'LABEL',
    unitOverrideLabel: 'UNIT OVERRIDE',
    unitOverridePlaceholder: 'auto-detected',
    defaultRangeLabel: 'DEFAULT RANGE',
    widgetLabels: {
      'value-card':    { label: 'Value Card',    desc: 'Live numeric reading with trend' },
      'gauge':         { label: 'Gauge',         desc: 'Arc gauge with thresholds' },
      'line-chart':    { label: 'Line Chart',    desc: 'Historical time-series' },
      'color-preview': { label: 'Color Preview', desc: 'TCS230 swatch + RGB bars' },
      'status-badge':  { label: 'Status',        desc: 'Device online / offline' },
    },
    presets: {
      hcsr04: { label: 'HC-SR04 Ultrasonic', sub: 'distance · cm' },
      tcs230: { label: 'TCS230 Color',       sub: 'rgb · 0–255' },
    },
    summaryType:   'TYPE',
    summarySensor: 'SENSOR',
  },

  // ── Error Boundary ───────────────────────
  error: {
    title: 'Something went wrong',
    tryAgain: 'TRY AGAIN',
    retry: 'RETRY',
  },

  // ── Docs ────────────────────────────────
  docs: {
    toc: {
      contents: 'CONTENTS',
      overview:        'Overview',
      prerequisites:   'Prerequisites',
      wiring:          'Wiring',
      firmware:        'Firmware',
      platformSetup:   'Platform Setup',
      addingWidgets:   'Adding Widgets',
      troubleshooting: 'Troubleshooting',
    },

    overview: {
      sectionNum: '01', sectionLabel: 'OVERVIEW',
      title: 'What is ESP-MONITOR?',
      body: 'ESP-MONITOR is a full-stack IoT platform that lets you stream live sensor data from an ESP32 microcontroller to a real-time web dashboard. Data flows over MQTT to a Node.js backend, which pushes it instantly to your browser via WebSockets — typically in under 100 ms.',
      archLabel: 'ARCHITECTURE',
      archNodes: [
        { label: 'ESP32',      sub: 'sensor node' },
        { label: 'EMQX',       sub: 'MQTT broker' },
        { label: 'API',        sub: 'Node.js backend' },
        { label: 'Dashboard',  sub: 'React app' },
      ],
      stats: [
        ['<100ms', 'end-to-end latency'],
        ['MQTT',   'publish protocol'],
        ['WebSocket', 'live push to browser'],
      ] as [string, string][],
    },

    prerequisites: {
      sectionNum: '02', sectionLabel: 'PREREQUISITES',
      title: 'What you need',
      hardwareLabel: 'HARDWARE',
      hardware: [
        ['ESP32 DevKit v1 (or any ESP32 board)', 'The microcontroller running your firmware'],
        ['HC-SR04 ultrasonic sensor',             'Measures distance in centimetres'],
        ['TCS230 colour sensor module',            'Reads R / G / B values (0–255)'],
        ['Breadboard + jumper wires',              'For prototyping connections'],
        ['Micro-USB cable',                        'For flashing firmware and power'],
      ] as [string, string][],
      softwareLabel: 'SOFTWARE',
      software: [
        ['Arduino IDE 2.x',            'arduino.cc/en/software',                                                     'The editor used to write and flash firmware'],
        ['ESP32 board package v2.x',   'Install via Arduino Board Manager → search "esp32" by Espressif',            ''],
        ['PubSubClient library v2.8+', 'Install via Arduino Library Manager → search "PubSubClient" by Nick O\'Leary', ''],
      ] as [string, string, string][],
      wifiNote: 'The ESP32 board package includes the built-in WiFi.h library. You do not need to install it separately.',
    },

    wiring: {
      sectionNum: '03', sectionLabel: 'WIRING',
      title: 'Connecting your sensors',
      hcTitle: 'HC-SR04 Ultrasonic Sensor',
      hcDesc: "The HC-SR04 works at 3.3 V or 5 V. If powering from the ESP32's 5 V (VIN) pin, add a 100 Ω resistor in series on the ECHO line, or use a simple voltage divider, so the ECHO signal does not exceed 3.3 V on the ESP32 input.",
      hcHeaders: ['HC-SR04 PIN', 'ESP32 PIN', 'NOTES'],
      hcRows: [
        ['VCC',  '5 V (VIN) or 3.3 V', 'Sensor works on both voltages'],
        ['GND',  'GND',                 ''],
        ['TRIG', 'GPIO 5',              'Any digital output pin'],
        ['ECHO', 'GPIO 18',             'Add 100 Ω resistor if running at 5 V'],
      ] as string[][],
      tcsTitle: 'TCS230 Colour Sensor',
      tcsDesc: 'The TCS230 outputs a square wave whose frequency is proportional to light intensity for the selected colour channel. GPIO 34 is an input-only pin on most ESP32 boards — perfect here since we only read from OUT. The OE (Output Enable) pin should be tied to GND so the sensor is always active.',
      tcsHeaders: ['TCS230 PIN', 'ESP32 PIN', 'NOTES'],
      tcsRows: [
        ['VCC', '3.3 V',   'Do not use 5 V — ESP32 is 3.3 V logic'],
        ['GND', 'GND',     ''],
        ['OUT', 'GPIO 34', 'Input-only pin, reads frequency output'],
        ['S0',  'GPIO 25', 'Frequency scaling (S0=H, S1=L → 20%)'],
        ['S1',  'GPIO 26', 'Frequency scaling'],
        ['S2',  'GPIO 27', 'Colour filter select'],
        ['S3',  'GPIO 14', 'Colour filter select'],
        ['OE',  'GND',     'Tie low to keep sensor enabled'],
      ] as string[][],
      gpioWarning: 'GPIO 34–39 on the ESP32 are input-only — they have no internal pull-up/pull-down and cannot be set as outputs. GPIO 34 is used here intentionally for the TCS230 OUT signal.',
    },

    firmware: {
      sectionNum: '04', sectionLabel: 'FIRMWARE',
      title: 'Arduino sketches',
      intro: 'Each sketch below is a complete, self-contained .ino file. Replace every YOUR_* placeholder with the values from your device\'s credentials modal on the Devices page.',
      credsNote: 'Copy your MQTT_USERNAME, MQTT_PASSWORD, and MQTT_TOPIC from the Devices page → Add Device → credentials modal. The MQTT_HOST is the IP address or hostname of the machine running Docker (e.g. 192.168.1.100).',
      hcTitle: 'HC-SR04 — Distance Sensor',
      hcDesc: 'Publishes a reading every 500 ms. The JSON payload shape matches what the backend expects.',
      tcsTitle: 'TCS230 — Colour Sensor',
      tcsDesc: 'Reads R, G, B channels sequentially and publishes them as a single JSON object. The readChannel() function counts output pulses over 50 ms and maps the result to 0–255. You may need to adjust the map() range to suit your lighting environment.',
      passwordWarning: 'The MQTT password is shown only once when you create a device. If you lose it, delete the device and create a new one.',
    },

    platformSetup: {
      sectionNum: '05', sectionLabel: 'PLATFORM SETUP',
      title: 'Getting online, step by step',
      steps: [
        {
          title: 'Start the infrastructure',
          body: 'Make sure Docker is running, then from the project root:',
          code: 'docker compose up -d\ncd server && npm run dev\ncd client && npm run dev',
          after: 'The dashboard will be available at http://localhost:5173.',
        },
        {
          title: 'Create an account',
          body: 'Navigate to /register and sign up with your email and a password of at least 6 characters.',
        },
        {
          title: 'Add a device',
          body: 'Go to the Devices page, click Add Device, and give your ESP32 a name (e.g. "Greenhouse Node 1"). Click Create Device.',
        },
        {
          title: 'Copy the credentials',
          body: 'A modal appears with five values. Copy the MQTT password now — it will not be shown again. You will paste these into the YOUR_* placeholders in the firmware sketch.',
          warning: 'If you close the modal without saving the password, delete the device and create a new one to get fresh credentials.',
        },
        {
          title: 'Flash the firmware',
          body: 'Open the appropriate sketch in Arduino IDE. Fill in your WiFi and MQTT credentials. Select the correct board (ESP32 Dev Module) and COM port, then click Upload.',
        },
        {
          title: 'Verify the connection',
          body: 'Open the Serial Monitor (115200 baud). You should see "WiFi connected" then "MQTT connected" followed by JSON payloads being printed. On the Devices page the device status badge should switch to ONLINE.',
        },
      ],
    },

    addingWidgets: {
      sectionNum: '06', sectionLabel: 'ADDING WIDGETS',
      title: 'Building your dashboard',
      intro: 'Once your device is online, open its dashboard and configure widgets to visualise the incoming sensor data.',
      steps: [
        { title: 'Enter edit mode',       body: 'Click the EDIT button in the top-right of the dashboard. A blue banner appears at the top confirming you are in edit mode.' },
        { title: 'Open the widget picker', body: 'Click ADD WIDGET. A three-step modal appears.' },
        { title: 'Step 1 — Choose a widget type', body: '' },
        { title: 'Step 2 — Select a sensor',      body: 'Choose hcsr04 for the ultrasonic sensor or tcs230 for the colour sensor. You can also type a custom sensor type if you are publishing a different sensor.' },
        { title: 'Step 3 — Configure (optional)', body: 'Set a custom label, unit override, or min/max range depending on the widget type. Color Preview and Status Badge have no configuration — the modal skips straight to the Add button.' },
        { title: 'Arrange the layout',    body: 'Drag widgets by their header area to reposition. Resize by dragging the handle in the bottom-right corner. Click the × button to remove a widget.' },
        { title: 'Save',                  body: 'Click DONE. The layout is saved automatically to the server. An "Unsaved" indicator in the topbar shows when there are pending changes.' },
      ],
      widgetTableHeaders: ['WIDGET', 'BEST FOR', 'DEFAULT SIZE'],
      widgetRows: [
        ['Value Card',    'Live numeric reading with trend arrow', '3 × 2 cells'],
        ['Gauge',         'Value within a min/max range',          '3 × 3 cells'],
        ['Line Chart',    'Historical time-series (1h to 7d)',      '6 × 3 cells'],
        ['Color Preview', 'TCS230 live colour swatch + RGB bars',  '3 × 3 cells'],
        ['Status Badge',  'Device online / offline indicator',      '2 × 2 cells'],
      ] as string[][],
      sensorTypeNote: 'The sensorType you pick in the widget must exactly match the "type" field in your firmware\'s JSON payload. For example, if the firmware sends "type":"hcsr04", the widget must be configured with sensor type hcsr04.',
    },

    troubleshooting: {
      sectionNum: '07', sectionLabel: 'TROUBLESHOOTING',
      title: 'Common issues',
      items: [
        {
          q: "MQTT won't connect — rc=-2 or rc=-4 in Serial Monitor",
          a: 'This means the ESP32 cannot reach the broker or the credentials are wrong.',
          bullets: [
            'Confirm MQTT_HOST is the correct LAN IP of the machine running Docker (run ipconfig / ifconfig to find it).',
            'Verify MQTT_USER and MQTT_PASS match exactly what is shown on the Devices page.',
            'Make sure Docker is running and EMQX is healthy: docker compose ps.',
            'Check that port 1883 is not blocked by a firewall on the host machine.',
          ],
        },
        {
          q: 'Device shows ONLINE but no data appears on the dashboard',
          a: '',
          bullets: [
            'Open the Serial Monitor and confirm JSON payloads are being printed.',
            'Check the payload shape matches exactly: {"sensors":[{"type":"hcsr04","value":24.5,"unit":"cm"}]}',
            'Verify the MQTT_TOPIC in the firmware matches the topic shown on the Devices page.',
            "Check that the widget's sensor type matches the \"type\" field in the payload.",
            'Reload the dashboard page — the WebSocket connection may need to re-establish.',
          ],
        },
        {
          q: 'HC-SR04 always reads 0 or very large values',
          a: '',
          bullets: [
            'Check TRIG and ECHO are not swapped on the breadboard.',
            'If powering at 5 V, ensure a 100 Ω resistor is on the ECHO line — without it the 5 V signal can damage the GPIO.',
            'The pulseIn timeout in the sketch is 30 ms (covers ~5 m). If the target is further away, increase it.',
            'Make sure nothing is placed within ~2 cm of the sensor — HC-SR04 has a minimum range.',
          ],
        },
        {
          q: 'TCS230 reads all zeros for R, G, B',
          a: '',
          bullets: [
            'Confirm OE pin is tied to GND, not left floating.',
            'Check S0–S3 wiring matches the defines in the sketch.',
            'The sensor needs adequate ambient or directed light — test with a bright white surface nearby.',
            'GPIO 34 is input-only with no pull-up. If the line is floating (not connected), pulseIn will return garbage. Verify the wire connection.',
            'Increase the count window in readChannel() from 50 ms to 100 ms for low-frequency environments.',
          ],
        },
        {
          q: 'Dashboard shows OFFLINE even after flashing',
          a: '',
          bullets: [
            'The device status is updated when an MQTT message is received. If the ESP32 is not publishing, the status stays offline.',
            'Check WiFi RSSI in Serial Monitor — a weak signal can cause intermittent drops.',
            'Increase the loop delay if the broker is rate-limiting.',
            'Check that the backend server (port 4000) is running: npm run dev in the server folder.',
          ],
        },
        {
          q: 'Widget shows IDLE and never updates',
          a: 'The widget is receiving no data for its configured sensor type.',
          bullets: [
            'The "sensorType" in the widget config must exactly match the "type" field in the JSON payload (case-sensitive).',
            'Open browser DevTools → Network → WS and confirm WebSocket frames are arriving.',
            'Confirm the device ID in the URL matches the device whose firmware is publishing.',
          ],
        },
      ],
    },
  },
};

export type Translations = typeof en;
export default en;
