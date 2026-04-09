## Project Structure

```
ESP-MONITOR # 
├── .claude # 
│   └── settings.local.json # 
├── client # 
│   ├── public # 
│   │   ├── favicon.svg # 
│   │   └── icons.svg # 
│   ├── src # 
│   │   ├── assets # 
│   │   │   ├── hero.png # 
│   │   │   ├── react.svg # 
│   │   │   └── vite.svg # 
│   │   ├── components # 
│   │   │   ├── dashboard # 
│   │   │   │   ├── AddWidgetModal.tsx # 
│   │   │   │   └── DraggableGrid.tsx # 
│   │   │   ├── layout # 
│   │   │   │   ├── AppLayout.tsx # 
│   │   │   │   └── Sidebar.tsx # 
│   │   │   ├── ui # 
│   │   │   │   ├── Badge.tsx # 
│   │   │   │   ├── Button.tsx # 
│   │   │   │   ├── CopyButton.tsx # 
│   │   │   │   ├── Input.tsx # 
│   │   │   │   ├── Modal.tsx # 
│   │   │   │   └── Spinner.tsx # 
│   │   │   └── widgets # 
│   │   │       ├── ColorPreviewWidget.tsx # 
│   │   │       ├── GaugeWidget.tsx # 
│   │   │       ├── LineChartWidget.tsx # 
│   │   │       ├── StatusBadgeWidget.tsx # 
│   │   │       ├── ValueCard.tsx # 
│   │   │       └── WidgetFactory.tsx # 
│   │   ├── hooks # 
│   │   │   ├── useAuth.ts # 
│   │   │   ├── useDashboard.ts # 
│   │   │   ├── useDevices.ts # 
│   │   │   ├── useSensorHistory.ts # 
│   │   │   └── useWebSocket.ts # 
│   │   ├── pages # 
│   │   │   ├── Dashboard.tsx # 
│   │   │   ├── Devices.tsx # 
│   │   │   ├── Login.tsx # 
│   │   │   └── Register.tsx # 
│   │   ├── services # 
│   │   │   ├── api.ts # 
│   │   │   └── ws.ts # 
│   │   ├── store # 
│   │   │   ├── authStore.ts # 
│   │   │   ├── dashboardStore.ts # 
│   │   │   └── sensorStore.ts # 
│   │   ├── types # 
│   │   │   ├── device.types.ts # 
│   │   │   ├── sensor.types.ts # 
│   │   │   └── widget.types.ts # 
│   │   ├── App.css # 
│   │   ├── App.tsx # 
│   │   ├── index.css # 
│   │   └── main.tsx # 
│   ├── .env # 
│   ├── .gitignore # 
│   ├── eslint.config.js # 
│   ├── index.html # 
│   ├── package-lock.json # 
│   ├── package.json # 
│   ├── README.md # 
│   ├── tsconfig.app.json # 
│   ├── tsconfig.json # 
│   ├── tsconfig.node.json # 
│   └── vite.config.ts # 
├── docker # 
│   ├── emqx # 
│   │   └── emqx.conf # 
│   └── mongo # 
│       └── init.js # 
├── server # 
│   ├── src # 
│   │   ├── config # 
│   │   │   ├── db.ts # 
│   │   │   ├── env.ts # 
│   │   │   ├── jwt.ts # 
│   │   │   └── logger.ts # 
│   │   ├── controllers # 
│   │   │   ├── authController.ts # 
│   │   │   ├── dashboardController.ts # 
│   │   │   ├── deviceController.ts # 
│   │   │   ├── mqttAuthController.ts # 
│   │   │   └── sensorController.ts # 
│   │   ├── middleware # 
│   │   │   ├── authMiddleware.ts # 
│   │   │   └── errorHandler.ts # 
│   │   ├── models # 
│   │   │   ├── DashboardLayout.ts # 
│   │   │   ├── Device.ts # 
│   │   │   ├── SensorReading.ts # 
│   │   │   └── User.ts # 
│   │   ├── routes # 
│   │   │   ├── auth.ts # 
│   │   │   ├── dashboard.ts # 
│   │   │   ├── devices.ts # 
│   │   │   ├── mqttAuth.ts # 
│   │   │   └── sensors.ts # 
│   │   ├── services # 
│   │   │   ├── MQTTService.ts # 
│   │   │   └── WebSocketService.ts # 
│   │   ├── types # 
│   │   │   └── express.d.ts # 
│   │   ├── app.ts # 
│   │   └── server.ts # 
│   ├── .env # 
│   ├── .env.example # 
│   ├── package-lock.json # 
│   ├── package.json # 
│   └── tsconfig.json # 
├── .gitignore # 
├── AGENTS.md # 
├── CLAUDE.md # 
├── docker-compose.yml # 
└── package.json # 
```
