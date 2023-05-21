import { Report_Environment } from '../reports/report_environment';

export const MessageUtils_Seperator = `
──────────────────────────────────────────────────────────────────────────────
`.trim();

export const MessageUtils_ServerBootHeader = `
${''.padStart(5, '\n')}
${MessageUtils_Seperator.trimEnd()}

    🔴🔴⚪⚪⚪⚪⚪    Electronic Mobility Co.
    🔴⚪⚪⚪⚪⚪🔴    
    ⚪⚪⚪⚪⚪🔴🔴    Core Operations Control Server (COCS) v0.01
`;

export const MessageUtils_ServiceEnvironmentReport = (
  environment: Awaited<ReturnType<typeof Report_Environment>>
) => {
  const report = new Map();

  report.set(
    'Service Process',
    `${environment.process.pid} (${environment.process.ppid})`
  );
  report.set(
    'Runtime',
    `Node ${environment.process.versions.node} (v8 ${environment.process.versions.v8})`
  );
  report.set(
    'Environment',
    `${environment.host.hostname} (${environment.host.type} on ${environment.host.platform})`
  );
  report.set(
    'Processors',
    `${environment.hardware.arch} - ${environment.hardware.proc_count} avalible`
  );
  for (const cpu of environment.hardware.processors) {
    report.set(
      ``,
      `${environment.hardware.processors.indexOf(cpu)}: ${cpu.model} @ ${
        cpu.speed
      }MHz`
    );
  }
  report.set(
    'Parallelism',
    `${
      environment.hardware.parallelism.avalible ? 'Avalible' : 'Not Avalible'
    } - ${
      environment.hardware.parallelism.avalible
        ? environment.hardware.proc_count *
          environment.hardware.parallelism.factor
        : environment.hardware.proc_count
    } threads recommended`
  );

  return [...report]
    .map(
      ([key, value]) =>
        `${(key !== '' ? key + ':' : '').padEnd(22, ' ')}${value}`
    )
    .join('\n');
};
