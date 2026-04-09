import { useState, useEffect, useRef } from 'react';
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import CopyButton from '../components/ui/CopyButton';
import { useI18n } from '../i18n/context';

/* ─────────────────────────────────────────────
   HOOK — track active TOC section
───────────────────────────────────────────── */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-15% 0px -75% 0px' },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);
  return active;
}

/* ─────────────────────────────────────────────
   SHARED SUB-COMPONENTS
───────────────────────────────────────────── */
function SectionHeader({ num, label, title }: { num: string; label: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-[9px] font-mono font-bold tracking-[0.22em] text-lo mb-2">{num} — {label}</p>
      <h2 className="text-xl font-bold text-hi">{title}</h2>
      <div className="mt-4" style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
    </div>
  );
}

function CodeBlock({ code, lang = 'cpp' }: { code: string; lang?: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden my-4"
      style={{ background: '#060b16', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
        <span className="text-[10px] font-mono text-lo tracking-widest">{lang.toUpperCase()}</span>
        <CopyButton text={code} />
      </div>
      <pre className="px-4 py-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-mid" dir="ltr">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function InfoBanner({ variant = 'info', children }: { variant?: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = {
    info:    { border: '1px solid rgba(14,165,233,0.25)',  bg: 'rgba(14,165,233,0.07)',  icon: InformationCircleIcon,   color: '#0ea5e9' },
    warning: { border: '1px solid rgba(245,158,11,0.25)', bg: 'rgba(245,158,11,0.08)',  icon: ExclamationTriangleIcon, color: '#f59e0b' },
  }[variant];
  const Icon = styles.icon;
  return (
    <div className="flex items-start gap-3 rounded-xl px-4 py-3.5 my-4"
      style={{ border: styles.border, background: styles.bg }}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: styles.color }} />
      <div className="text-sm text-mid leading-relaxed">{children}</div>
    </div>
  );
}

function StepList({ steps }: { steps: { title: string; body: React.ReactNode }[] }) {
  return (
    <ol className="flex flex-col gap-0 my-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold text-primary flex-shrink-0"
              style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.25)' }}>
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 mt-1 mb-1 min-h-[16px]"
                style={{ background: 'rgba(255,255,255,0.07)' }} />
            )}
          </div>
          <div className="pb-6 min-w-0">
            <p className="text-sm font-semibold text-hi mb-1">{step.title}</p>
            <div className="text-sm text-mid leading-relaxed">{step.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function WiringTable({ rows, headers }: { rows: string[][]; headers: string[] }) {
  return (
    <div className="rounded-xl overflow-hidden my-4"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[9px] font-mono font-bold tracking-[0.18em] text-lo">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined }}>
              {row.map((cell, j) => (
                <td key={j} className={clsx('px-4 py-2.5', j === 0 ? 'font-mono text-primary text-xs' : 'text-mid text-xs', j === row.length - 1 ? 'text-lo' : '')}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Accordion({ items }: { items: { q: string; a: string; bullets: string[] }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-2 my-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)', background: open === i ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
          >
            <span className="text-sm font-semibold text-hi">{item.q}</span>
            <ChevronDownIcon
              className="w-4 h-4 text-lo flex-shrink-0 transition-transform duration-200"
              style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm text-mid leading-relaxed animate-fade-up"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="pt-3">
                {item.a && <p className="mb-2">{item.a}</p>}
                <ul className="flex flex-col gap-1.5">
                  {item.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">·</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FIRMWARE CODE STRINGS (language-independent)
───────────────────────────────────────────── */
const HC_SR04_SKETCH = `#include <WiFi.h>
#include <PubSubClient.h>

// ── WiFi credentials ──────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// ── MQTT credentials (from Devices page) ──
const char* MQTT_HOST     = "YOUR_BROKER_HOST";   // e.g. 192.168.1.100
const int   MQTT_PORT     = 1883;
const char* MQTT_USER     = "YOUR_MQTT_USERNAME"; // e.g. device-abc123
const char* MQTT_PASS     = "YOUR_MQTT_PASSWORD";
const char* MQTT_TOPIC    = "YOUR_MQTT_TOPIC";    // e.g. esp/abc123/sensors

// ── HC-SR04 pins ──────────────────────────
#define TRIG_PIN 5
#define ECHO_PIN 18

WiFiClient   espClient;
PubSubClient mqtt(espClient);

void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected");
}

void connectMQTT() {
  while (!mqtt.connected()) {
    Serial.print("Connecting to MQTT...");
    String clientId = "esp32-" + String(random(0xffff), HEX);
    if (mqtt.connect(clientId.c_str(), MQTT_USER, MQTT_PASS)) {
      Serial.println(" connected");
    } else {
      Serial.print(" failed (rc=");
      Serial.print(mqtt.state());
      Serial.println(") retrying in 5s");
      delay(5000);
    }
  }
}

float measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout
  return duration * 0.0343 / 2.0;                 // cm
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  connectWiFi();
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
}

void loop() {
  if (!mqtt.connected()) connectMQTT();
  mqtt.loop();

  float dist = measureDistance();

  // Build JSON payload
  char payload[128];
  snprintf(payload, sizeof(payload),
    "{\\"sensors\\":[{\\"type\\":\\"hcsr04\\",\\"value\\":%.1f,\\"unit\\":\\"cm\\"}]}",
    dist);

  mqtt.publish(MQTT_TOPIC, payload);
  Serial.println(payload);

  delay(500); // publish every 500 ms
}`;

const TCS230_SKETCH = `#include <WiFi.h>
#include <PubSubClient.h>

// ── WiFi credentials ──────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// ── MQTT credentials (from Devices page) ──
const char* MQTT_HOST  = "YOUR_BROKER_HOST";
const int   MQTT_PORT  = 1883;
const char* MQTT_USER  = "YOUR_MQTT_USERNAME";
const char* MQTT_PASS  = "YOUR_MQTT_PASSWORD";
const char* MQTT_TOPIC = "YOUR_MQTT_TOPIC";

// ── TCS230 pins ───────────────────────────
#define S0_PIN  25
#define S1_PIN  26
#define S2_PIN  27
#define S3_PIN  14
#define OUT_PIN 34   // input-only GPIO, fine for frequency reading

WiFiClient   espClient;
PubSubClient mqtt(espClient);

void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println(" connected");
}

void connectMQTT() {
  while (!mqtt.connected()) {
    String clientId = "esp32-" + String(random(0xffff), HEX);
    if (mqtt.connect(clientId.c_str(), MQTT_USER, MQTT_PASS)) {
      Serial.println("MQTT connected");
    } else {
      delay(5000);
    }
  }
}

// Read one colour channel.
// S2/S3 select: R=(L,L)  G=(H,H)  B=(L,H)
int readChannel(bool s2, bool s3) {
  digitalWrite(S2_PIN, s2);
  digitalWrite(S3_PIN, s3);
  delay(10); // settle
  // Count pulses for 50 ms — higher count = more of that colour
  long count = 0;
  unsigned long start = millis();
  while (millis() - start < 50) {
    if (pulseIn(OUT_PIN, LOW, 100000) > 0) count++;
  }
  // Map raw count to 0-255 (calibrate min/max for your lighting)
  return (int)constrain(map(count, 0, 200, 0, 255), 0, 255);
}

void setup() {
  Serial.begin(115200);
  pinMode(S0_PIN,  OUTPUT);
  pinMode(S1_PIN,  OUTPUT);
  pinMode(S2_PIN,  OUTPUT);
  pinMode(S3_PIN,  OUTPUT);
  pinMode(OUT_PIN, INPUT);

  // Set output frequency scaling to 20%
  digitalWrite(S0_PIN, HIGH);
  digitalWrite(S1_PIN, LOW);

  connectWiFi();
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
}

void loop() {
  if (!mqtt.connected()) connectMQTT();
  mqtt.loop();

  int r = readChannel(LOW,  LOW);   // Red
  int g = readChannel(HIGH, HIGH);  // Green
  int b = readChannel(LOW,  HIGH);  // Blue

  char payload[160];
  snprintf(payload, sizeof(payload),
    "{\\"sensors\\":[{\\"type\\":\\"tcs230\\",\\"value\\":{\\"r\\":%d,\\"g\\":%d,\\"b\\":%d},\\"unit\\":\\"rgb\\"}]}",
    r, g, b);

  mqtt.publish(MQTT_TOPIC, payload);
  Serial.println(payload);

  delay(300);
}`;

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const TOC_IDS = ['overview', 'prerequisites', 'wiring', 'firmware', 'platform-setup', 'adding-widgets', 'troubleshooting'];

export default function Docs() {
  const { t } = useI18n();
  const d = t.docs;
  const active = useActiveSection(TOC_IDS);
  const contentRef = useRef<HTMLDivElement>(null);

  const TOC = [
    { id: 'overview',        label: d.toc.overview },
    { id: 'prerequisites',   label: d.toc.prerequisites },
    { id: 'wiring',          label: d.toc.wiring },
    { id: 'firmware',        label: d.toc.firmware },
    { id: 'platform-setup',  label: d.toc.platformSetup },
    { id: 'adding-widgets',  label: d.toc.addingWidgets },
    { id: 'troubleshooting', label: d.toc.troubleshooting },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-full min-h-0">

      {/* ── TOC sidebar ── */}
      <aside className="hidden lg:flex flex-col w-52 flex-shrink-0 py-8 px-3"
        style={{ background: '#060b16', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[9px] font-mono font-bold tracking-[0.2em] text-lo px-3 mb-4">{d.toc.contents}</p>
        <nav className="flex flex-col gap-0.5">
          {TOC.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150 text-sm"
                style={isActive
                  ? { color: '#f0f4ff', background: 'rgba(14,165,233,0.10)' }
                  : { color: '#3d5070' }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#7a8ba8'; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#3d5070'; }}
              >
                {isActive && (
                  <span className="absolute start-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-e-full"
                    style={{ background: '#0ea5e9', boxShadow: '0 0 6px rgba(14,165,233,0.6)' }} />
                )}
                <span className={clsx('font-medium', isActive ? 'text-hi' : '')}>{label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Scrollable content ── */}
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10 pb-24">

          {/* ══════════════════════════════════
              SECTION 1 — OVERVIEW
          ══════════════════════════════════ */}
          <section id="overview" className="mb-16">
            <SectionHeader num={d.overview.sectionNum} label={d.overview.sectionLabel} title={d.overview.title} />
            <p className="text-sm text-mid leading-relaxed mb-6">{d.overview.body}</p>

            {/* Architecture diagram */}
            <div className="rounded-xl overflow-hidden my-6"
              style={{ background: '#060b16', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="px-4 py-2 text-[10px] font-mono text-lo"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{d.overview.archLabel}</div>
              <div className="px-6 py-6 flex items-center justify-between gap-2 overflow-x-auto" dir="ltr">
                {d.overview.archNodes.flatMap((node, i, arr) => {
                  const els = [
                    <div key={`node-${i}`} className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className="px-3 py-2 rounded-lg text-xs font-mono font-bold text-hi text-center min-w-[72px]"
                        style={{ background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.20)' }}>
                        {node.label}
                      </div>
                      <span className="text-[9px] font-mono text-lo">{node.sub}</span>
                    </div>,
                  ];
                  if (i < arr.length - 1) {
                    els.push(
                      <div key={`arrow-${i}`} className="flex items-center gap-1 flex-shrink-0">
                        <div className="w-6 h-px" style={{ background: 'rgba(14,165,233,0.4)' }} />
                        <div className="w-0 h-0" style={{
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent',
                          borderLeft: '6px solid rgba(14,165,233,0.4)',
                        }} />
                      </div>
                    );
                  }
                  return els;
                })}
              </div>
            </div>

            <div className="flex gap-3 flex-wrap mt-6">
              {(d.overview.stats as [string, string][]).map(([val, lbl]) => (
                <div key={lbl} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)' }}>
                  <span className="text-xs font-mono font-bold text-primary">{val}</span>
                  <span className="text-xs text-mid">{lbl}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════
              SECTION 2 — PREREQUISITES
          ══════════════════════════════════ */}
          <section id="prerequisites" className="mb-16">
            <SectionHeader num={d.prerequisites.sectionNum} label={d.prerequisites.sectionLabel} title={d.prerequisites.title} />

            <p className="text-[10px] font-mono font-bold tracking-widest text-lo mb-3">{d.prerequisites.hardwareLabel}</p>
            <ul className="flex flex-col gap-2 mb-6">
              {(d.prerequisites.hardware as [string, string][]).map(([name, desc]) => (
                <li key={name} className="flex items-start gap-3 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: '#0ea5e9', boxShadow: '0 0 5px rgba(14,165,233,0.5)' }} />
                  <span>
                    <span className="text-hi font-medium">{name}</span>
                    <span className="text-lo"> — {desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-[10px] font-mono font-bold tracking-widest text-lo mb-3">{d.prerequisites.softwareLabel}</p>
            <ul className="flex flex-col gap-2">
              {(d.prerequisites.software as [string, string, string][]).map(([name, where, desc]) => (
                <li key={name} className="flex items-start gap-3 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: '#8b5cf6', boxShadow: '0 0 5px rgba(139,92,246,0.4)' }} />
                  <span>
                    <span className="text-hi font-medium">{name}</span>
                    {where && <span className="text-primary font-mono text-[11px]"> — {where}</span>}
                    {desc && <span className="text-lo"> — {desc}</span>}
                  </span>
                </li>
              ))}
            </ul>

            <InfoBanner variant="info">{d.prerequisites.wifiNote}</InfoBanner>
          </section>

          {/* ══════════════════════════════════
              SECTION 3 — WIRING
          ══════════════════════════════════ */}
          <section id="wiring" className="mb-16">
            <SectionHeader num={d.wiring.sectionNum} label={d.wiring.sectionLabel} title={d.wiring.title} />

            <h3 className="text-base font-bold text-hi mb-1">{d.wiring.hcTitle}</h3>
            <p className="text-sm text-mid mb-4 leading-relaxed">{d.wiring.hcDesc}</p>

            <CodeBlock lang="wiring diagram" code={`┌──────────────┐               ┌─────────────────────┐
│   HC-SR04    │               │        ESP32         │
│              │               │                      │
│   VCC ───────┼───────────────┼─── 5V (VIN) / 3.3V  │
│   GND ───────┼───────────────┼─── GND               │
│   TRIG ──────┼───────────────┼─── GPIO 5  (output)  │
│   ECHO ──────┼── (100Ω) ─────┼─── GPIO 18 (input)   │
│              │               │                      │
└──────────────┘               └─────────────────────┘`} />

            <WiringTable headers={d.wiring.hcHeaders as unknown as string[]} rows={d.wiring.hcRows as unknown as string[][]} />

            <h3 className="text-base font-bold text-hi mb-1 mt-10">{d.wiring.tcsTitle}</h3>
            <p className="text-sm text-mid mb-4 leading-relaxed">{d.wiring.tcsDesc}</p>

            <CodeBlock lang="wiring diagram" code={`┌──────────────┐               ┌─────────────────────┐
│   TCS230     │               │        ESP32         │
│              │               │                      │
│   VCC ───────┼───────────────┼─── 3.3 V             │
│   GND ───────┼───────────────┼─── GND               │
│   OUT ───────┼───────────────┼─── GPIO 34 (input)   │
│   S0  ───────┼───────────────┼─── GPIO 25           │
│   S1  ───────┼───────────────┼─── GPIO 26           │
│   S2  ───────┼───────────────┼─── GPIO 27           │
│   S3  ───────┼───────────────┼─── GPIO 14           │
│   OE  ───────┼───────────────┼─── GND  (always on)  │
│              │               │                      │
└──────────────┘               └─────────────────────┘`} />

            <WiringTable headers={d.wiring.tcsHeaders as unknown as string[]} rows={d.wiring.tcsRows as unknown as string[][]} />

            <InfoBanner variant="warning">{d.wiring.gpioWarning}</InfoBanner>
          </section>

          {/* ══════════════════════════════════
              SECTION 4 — FIRMWARE
          ══════════════════════════════════ */}
          <section id="firmware" className="mb-16">
            <SectionHeader num={d.firmware.sectionNum} label={d.firmware.sectionLabel} title={d.firmware.title} />
            <p className="text-sm text-mid leading-relaxed mb-6">{d.firmware.intro}</p>
            <InfoBanner variant="info">{d.firmware.credsNote}</InfoBanner>

            <h3 className="text-base font-bold text-hi mb-1 mt-6">{d.firmware.hcTitle}</h3>
            <p className="text-sm text-mid mb-2 leading-relaxed">{d.firmware.hcDesc}</p>
            <CodeBlock code={HC_SR04_SKETCH} />

            <h3 className="text-base font-bold text-hi mb-1 mt-8">{d.firmware.tcsTitle}</h3>
            <p className="text-sm text-mid mb-2 leading-relaxed">{d.firmware.tcsDesc}</p>
            <CodeBlock code={TCS230_SKETCH} />

            <InfoBanner variant="warning">{d.firmware.passwordWarning}</InfoBanner>
          </section>

          {/* ══════════════════════════════════
              SECTION 5 — PLATFORM SETUP
          ══════════════════════════════════ */}
          <section id="platform-setup" className="mb-16">
            <SectionHeader num={d.platformSetup.sectionNum} label={d.platformSetup.sectionLabel} title={d.platformSetup.title} />
            <StepList steps={d.platformSetup.steps.map((s) => ({
              title: s.title,
              body: (
                <>
                  <p>{s.body}</p>
                  {'code' in s && s.code && <CodeBlock lang="bash" code={s.code} />}
                  {'after' in s && s.after && <p>{s.after}</p>}
                  {'warning' in s && s.warning && <InfoBanner variant="warning">{s.warning}</InfoBanner>}
                </>
              ),
            }))} />
          </section>

          {/* ══════════════════════════════════
              SECTION 6 — ADDING WIDGETS
          ══════════════════════════════════ */}
          <section id="adding-widgets" className="mb-16">
            <SectionHeader num={d.addingWidgets.sectionNum} label={d.addingWidgets.sectionLabel} title={d.addingWidgets.title} />
            <p className="text-sm text-mid leading-relaxed mb-6">{d.addingWidgets.intro}</p>
            <StepList steps={d.addingWidgets.steps.map((s, i) => ({
              title: s.title,
              body: i === 2
                ? <WiringTable headers={d.addingWidgets.widgetTableHeaders as unknown as string[]} rows={d.addingWidgets.widgetRows as unknown as string[][]} />
                : <p>{s.body}</p>,
            }))} />
            <InfoBanner variant="info">{d.addingWidgets.sensorTypeNote}</InfoBanner>
          </section>

          {/* ══════════════════════════════════
              SECTION 7 — TROUBLESHOOTING
          ══════════════════════════════════ */}
          <section id="troubleshooting" className="mb-16">
            <SectionHeader num={d.troubleshooting.sectionNum} label={d.troubleshooting.sectionLabel} title={d.troubleshooting.title} />
            <Accordion items={d.troubleshooting.items as unknown as { q: string; a: string; bullets: string[] }[]} />
          </section>

        </div>
      </div>
    </div>
  );
}
