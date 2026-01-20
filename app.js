// ===== Global State =====
var currentCurrency = 'USD';
var conversionRate = 84;

var toolColors = [
  'linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)',
  'linear-gradient(180deg, #FF9800 0%, #F57C00 100%)',
  'linear-gradient(180deg, #FFB74D 0%, #FF9800 100%)',
  'linear-gradient(180deg, #E91E63 0%, #C2185B 100%)',
  'linear-gradient(180deg, #F44336 0%, #D32F2F 100%)'
];

document.addEventListener('DOMContentLoaded', function () {
  updateCompetitorTools();
  loadSettingsFromStorage();
  updateCurrencyDisplay();
});

// ===== Currency =====
function toggleCurrency() {
  var btn = document.getElementById('currencyBtn');
  var label = document.getElementById('currencyLabel');

  if (currentCurrency === 'USD') {
    currentCurrency = 'INR';
    btn.classList.add('pressed');
    label.textContent = 'INR';
    btn.querySelector('.currency-icon').textContent = '₹';
  } else {
    currentCurrency = 'USD';
    btn.classList.remove('pressed');
    label.textContent = 'USD';
    btn.querySelector('.currency-icon').textContent = '💵';
  }

  updateCurrencyDisplay();
}

function updateConversionRate() {
  var rateInput = document.getElementById('usdToInrRate');
  if (!rateInput) return;

  var newRate = parseFloat(rateInput.value);
  if (newRate && newRate > 0) conversionRate = newRate;

  if (currentCurrency === 'INR') updateCurrencyDisplay();
}

function updateCurrencyDisplay() {
  var symbols = document.querySelectorAll('.currency-symbol');
  var units = document.querySelectorAll('.currency-unit');

  symbols.forEach(function (symbol) {
    symbol.textContent = currentCurrency === 'USD' ? '$' : '₹';
  });

  units.forEach(function (unit) {
    unit.textContent = currentCurrency === 'USD' ? 'K' : 'Lakhs';
  });
}

function formatCurrency(num, isPerCore) {
  if (num === null || num === undefined || isNaN(num)) num = 0;

  var symbol = currentCurrency === 'USD' ? '$' : '₹';

  if (isPerCore) {
    return symbol + new Intl.NumberFormat('en-IN').format(Math.round(num));
  }

  if (currentCurrency === 'USD') {
    if (num >= 1000) return symbol + (num / 1000).toFixed(2) + 'M';
    return symbol + num.toFixed(2) + 'K';
  }

  if (num >= 100) return symbol + (num / 100).toFixed(2) + ' Cr';
  return symbol + num.toFixed(2) + ' L';
}

// ===== Settings Modal =====
function openSettings() {
  loadCurrentValuesToSettings();
  document.getElementById('settingsModal').classList.add('active');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('active');
}

function closeSettingsCancel() {
  closeSettings();
}

function loadCurrentValuesToSettings() {
  document.getElementById('settotalApps').value = document.getElementById('totalApps').value;
  document.getElementById('settotalVMs').value = document.getElementById('totalVMs').value;
  document.getElementById('setcurrentDensity').value = document.getElementById('currentDensity').value;
  document.getElementById('setnumDCs').value = document.getElementById('numDCs').value;

  document.getElementById('setvmwareCostPerCore').value = document.getElementById('vmwareCostPerCore').value;
  document.getElementById('setcurrentSecurityCoverage').value = document.getElementById('currentSecurityCoverage').value;
  document.getElementById('settargetSecurityCoverage').value = document.getElementById('targetSecurityCoverage').value;
  document.getElementById('setsecurityFTEs').value = document.getElementById('securityFTEs').value;

  document.getElementById('setcurrentRPO').value = document.getElementById('currentRPO').value;
  document.getElementById('setcurrentRTO').value = document.getElementById('currentRTO').value;
  document.getElementById('setdrTestFreq').value = document.getElementById('drTestFreq').value;
  document.getElementById('setdrTestDuration').value = document.getElementById('drTestDuration').value;
  document.getElementById('setdowntimeCost').value = document.getElementById('downtimeCost').value;

  document.getElementById('setdramPerHost').value = document.getElementById('dramPerHost').value;
  document.getElementById('setdramCost').value = document.getElementById('dramCost').value;
  document.getElementById('setnvmePerHost').value = document.getElementById('nvmePerHost').value;
  document.getElementById('setnvmeCost').value = document.getElementById('nvmeCost').value;

  document.getElementById('setcurrentDeployTime').value = document.getElementById('currentDeployTime').value;
  document.getElementById('setplannedSites').value = document.getElementById('plannedSites').value;
  document.getElementById('setitDailyCost').value = document.getElementById('itDailyCost').value;
  document.getElementById('setprodDelayCost').value = document.getElementById('prodDelayCost').value;
}

function saveSettings() {
  var settings = {
    totalApps: document.getElementById('settotalApps').value,
    totalVMs: document.getElementById('settotalVMs').value,
    currentDensity: document.getElementById('setcurrentDensity').value,
    numDCs: document.getElementById('setnumDCs').value,

    vmwareCostPerCore: document.getElementById('setvmwareCostPerCore').value,
    currentSecurityCoverage: document.getElementById('setcurrentSecurityCoverage').value,
    targetSecurityCoverage: document.getElementById('settargetSecurityCoverage').value,
    securityFTEs: document.getElementById('setsecurityFTEs').value,

    currentRPO: document.getElementById('setcurrentRPO').value,
    currentRTO: document.getElementById('setcurrentRTO').value,
    drTestFreq: document.getElementById('setdrTestFreq').value,
    drTestDuration: document.getElementById('setdrTestDuration').value,
    downtimeCost: document.getElementById('setdowntimeCost').value,

    dramPerHost: document.getElementById('setdramPerHost').value,
    dramCost: document.getElementById('setdramCost').value,
    nvmePerHost: document.getElementById('setnvmePerHost').value,
    nvmeCost: document.getElementById('setnvmeCost').value,

    currentDeployTime: document.getElementById('setcurrentDeployTime').value,
    plannedSites: document.getElementById('setplannedSites').value,
    itDailyCost: document.getElementById('setitDailyCost').value,
    prodDelayCost: document.getElementById('setprodDelayCost').value
  };

  localStorage.setItem('vcfCalculatorSettings', JSON.stringify(settings));
  applySettings(settings);
  closeSettings();
  alert('✅ Settings saved successfully!');
}

function applySettings(settings) {
  document.getElementById('totalApps').value = settings.totalApps;
  document.getElementById('totalVMs').value = settings.totalVMs;
  document.getElementById('currentDensity').value = settings.currentDensity;
  document.getElementById('numDCs').value = settings.numDCs;

  document.getElementById('vmwareCostPerCore').value = settings.vmwareCostPerCore;
  document.getElementById('currentSecurityCoverage').value = settings.currentSecurityCoverage;
  if (settings.targetSecurityCoverage !== undefined) {
    document.getElementById('targetSecurityCoverage').value = settings.targetSecurityCoverage;
  }
  document.getElementById('securityFTEs').value = settings.securityFTEs;

  document.getElementById('currentRPO').value = settings.currentRPO;
  document.getElementById('currentRTO').value = settings.currentRTO;
  document.getElementById('drTestFreq').value = settings.drTestFreq;
  document.getElementById('drTestDuration').value = settings.drTestDuration;
  document.getElementById('downtimeCost').value = settings.downtimeCost;

  document.getElementById('dramPerHost').value = settings.dramPerHost;
  document.getElementById('dramCost').value = settings.dramCost;
  document.getElementById('nvmePerHost').value = settings.nvmePerHost;
  document.getElementById('nvmeCost').value = settings.nvmeCost;

  document.getElementById('currentDeployTime').value = settings.currentDeployTime;
  document.getElementById('plannedSites').value = settings.plannedSites;
  document.getElementById('itDailyCost').value = settings.itDailyCost;
  document.getElementById('prodDelayCost').value = settings.prodDelayCost;
}

function loadSettingsFromStorage() {
  var saved = localStorage.getItem('vcfCalculatorSettings');
  if (saved) applySettings(JSON.parse(saved));
}

function resetDefaults() {
  if (!confirm('Reset all values to factory defaults?')) return;

  localStorage.removeItem('vcfCalculatorSettings');

  document.getElementById('settotalApps').value = 500;
  document.getElementById('settotalVMs').value = 1000;
  document.getElementById('setcurrentDensity').value = 15;
  document.getElementById('setnumDCs').value = 2;

  document.getElementById('setvmwareCostPerCore').value = 85;
  document.getElementById('setcurrentSecurityCoverage').value = 40;
  document.getElementById('settargetSecurityCoverage').value = 67;
  document.getElementById('setsecurityFTEs').value = 4;

  document.getElementById('setcurrentRPO').value = 60;
  document.getElementById('setcurrentRTO').value = 8;
  document.getElementById('setdrTestFreq').value = 2;
  document.getElementById('setdrTestDuration').value = 3;
  document.getElementById('setdowntimeCost').value = 0.6;

  document.getElementById('setdramPerHost').value = 2048;
  document.getElementById('setdramCost').value = 36;
  document.getElementById('setnvmePerHost').value = 10;
  document.getElementById('setnvmeCost').value = 2.4;

  document.getElementById('setcurrentDeployTime').value = 90;
  document.getElementById('setplannedSites').value = 5;
  document.getElementById('setitDailyCost').value = 0.024;
  document.getElementById('setprodDelayCost').value = 0.12;
}

// ===== Competitor Tools Dynamic UI =====
function updateCompetitorTools() {
  var numTools = parseInt(document.getElementById('numCompetitorTools').value, 10);
  var container = document.getElementById('competitorToolsContainer');
  container.innerHTML = '';

  var defaultNames = ['Firewall', 'IDS/IPS', 'NDR', 'ATP', 'SIEM'];
  var defaultCosts = [120, 36, 12, 24, 18];

  for (var i = 0; i < numTools; i++) {
    var toolDiv = document.createElement('div');
    toolDiv.className = 'tool-entry';
    toolDiv.innerHTML = `
      <div class="tool-entry-row">
        <div class="form-group">
          <label class="form-label">Product ${i + 1} Name</label>
          <input type="text" class="form-input competitor-tool-name"
                 value="${defaultNames[i] || ('Product ' + (i + 1))}"
                 placeholder="e.g., Firewall, IDS/IPS, NDR" />
        </div>

        <div class="form-group">
          <label class="form-label">Cost per Core <span class="currency-symbol"></span></label>
          <input type="number" class="form-input competitor-tool-cost"
                 value="${defaultCosts[i] || 12}" min="0" step="1" />
        </div>
      </div>
    `;
    container.appendChild(toolDiv);
  }

  updateCurrencyDisplay();
}

// ===== Help Modal =====
function showHelp(section) {
  var helpData = {
    infrastructure: {
      title: 'Infrastructure Baseline',
      content: `
        <div class="help-section">
          <h4>Purpose</h4>
          <p>These inputs size your environment for host count, core count, and workload coverage calculations.</p>
          <h4>Core Sizing</h4>
          <p><strong>Hosts Needed:</strong> Total VMs ÷ VMs per Host (rounded up)</p>
          <p><strong>Total Cores:</strong> Hosts × 128 cores per host (2×64 core servers)</p>
          <h4>Coverage</h4>
          <p><strong>Protected Apps:</strong> Total Apps × Coverage%</p>
        </div>
      `
    },

    security: {
      title: 'Lateral Security (ZTA)',
      content: (function () {
        var totalApps = parseInt(document.getElementById('totalApps')?.value, 10);
        if (isNaN(totalApps)) totalApps = 100;

        var currentCov = parseFloat(document.getElementById('currentSecurityCoverage')?.value);
        if (isNaN(currentCov)) currentCov = 0;

        var targetCov = parseFloat(document.getElementById('targetSecurityCoverage')?.value);
        if (isNaN(targetCov)) targetCov = currentCov;

        if (targetCov > 100) targetCov = 100;
        if (targetCov < 0) targetCov = 0;

        var currentApps = Math.round(totalApps * (currentCov / 100));
        var vcfApps = Math.round(totalApps * (targetCov / 100));
        var addApps = vcfApps - currentApps;
        if (addApps < 0) addApps = 0;

        var ppImprovement = targetCov - currentCov;

        return `
          <div class="help-section">
            <h4>🔐 Security Coverage Improvement</h4>
            <p><strong>Formulas:</strong><br>
              Apps Protected Today = Total Apps × (Current Coverage% / 100)<br>
              Apps Protected with vDefend = Total Apps × (Target Coverage% / 100)<br>
              Additional Apps Protected = Apps with vDefend − Apps Today<br>
              Coverage Improvement (pp) = Target Coverage% − Current Coverage%
            </p>
            <p><em>Example with your inputs:</em> ${currentCov}% → ${targetCov}% on ${totalApps} apps = ${currentApps} → ${vcfApps} apps protected, +${addApps} apps and +${ppImprovement} pp.</p>

            <h4>💰 Cost per Core Reduction</h4>
            <p>Annual savings are calculated from competitor per-core total vs vDefend per-core cost, multiplied by total cores.</p>

            <h4>🔧 Tool Consolidation</h4>
            <p>Estimated savings based on reducing multiple point-products into a single integrated platform.</p>

            <h4>👥 FTE Optimization</h4>
            <p>Estimated admin effort reduction factor applied to current security FTEs.</p>
          </div>
        `;
      })()
    },

    dr: {
      title: 'Active-Active DC & DR',
      content: `
        <div class="help-section">
          <h4>RPO / RTO</h4>
          <p>Assumes VCF enables 0 min RPO and 5 min RTO through automation and active-active design.</p>
          <h4>DR Testing</h4>
          <p>Current test effort vs automated/shortened test effort is used to estimate annual savings.</p>
        </div>
      `
    },

    platform: {
      title: 'Platform Efficiency',
      content: `
        <div class="help-section">
          <h4>Memory Tiering</h4>
          <p>Models a 35% DRAM reduction with NVMe tiering, comparing DRAM capex avoided vs NVMe cost.</p>
          <h4>VM Density</h4>
          <p>Models a 33% VM density improvement and estimates host reduction value.</p>
        </div>
      `
    },

    deployment: {
      title: 'Rapid Deployment',
      content: `
        <div class="help-section">
          <h4>Deployment Speed</h4>
          <p>Models new site deployment reduced to 7 days and estimates IT savings + time-to-market value.</p>
        </div>
      `
    }
  };

  var modal = document.getElementById('helpModal');
  var title = document.getElementById('helpTitle');
  var body = document.getElementById('helpBody');

  if (helpData[section]) {
    title.textContent = helpData[section].title;
    body.innerHTML = helpData[section].content;
  } else {
    title.textContent = 'Help';
    body.innerHTML = '<div class="help-section"><p>No help content available.</p></div>';
  }

  modal.classList.add('active');
}

function closeHelp() {
  document.getElementById('helpModal').classList.remove('active');
}

// Close modals when clicking outside
window.onclick = function (event) {
  var helpModal = document.getElementById('helpModal');
  var settingsModal = document.getElementById('settingsModal');

  if (event.target === helpModal) closeHelp();
  if (event.target === settingsModal) closeSettings();
};

// ===== Main Calculation Flow =====
function calculateValue() {
  try {
    var data = getFormData();
    var results = performCalculations(data);
    displayResults(results, data);

    document.getElementById('results').classList.add('active');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    alert('Error calculating values. Please check your inputs.');
    console.error(error);
  }
}

function getFormData() {
  var competitorTools = [];
  var toolNames = document.querySelectorAll('.competitor-tool-name');
  var toolCosts = document.querySelectorAll('.competitor-tool-cost');

  for (var i = 0; i < toolNames.length; i++) {
    competitorTools.push({
      name: (toolNames[i].value || ('Product ' + (i + 1))).trim(),
      cost: parseFloat(toolCosts[i].value || 0)
    });
  }

  return {
    totalApps: parseInt(document.getElementById('totalApps').value, 10),
    totalVMs: parseInt(document.getElementById('totalVMs').value, 10),
    currentDensity: parseInt(document.getElementById('currentDensity').value, 10),
    numDCs: parseInt(document.getElementById('numDCs').value, 10),

    vmwareCostPerCore: parseFloat(document.getElementById('vmwareCostPerCore').value),
    currentSecurityCoverage: parseFloat(document.getElementById('currentSecurityCoverage').value),
    targetSecurityCoverage: parseFloat(document.getElementById('targetSecurityCoverage').value),
    competitorTools: competitorTools,
    securityFTEs: parseInt(document.getElementById('securityFTEs').value, 10),

    currentRPO: parseFloat(document.getElementById('currentRPO').value),
    currentRTO: parseFloat(document.getElementById('currentRTO').value),
    drTestFreq: parseFloat(document.getElementById('drTestFreq').value),
    drTestDuration: parseFloat(document.getElementById('drTestDuration').value),
    downtimeCost: parseFloat(document.getElementById('downtimeCost').value),

    dramPerHost: parseFloat(document.getElementById('dramPerHost').value),
    dramCost: parseFloat(document.getElementById('dramCost').value),
    nvmePerHost: parseFloat(document.getElementById('nvmePerHost').value),
    nvmeCost: parseFloat(document.getElementById('nvmeCost').value),

    currentDeployTime: parseFloat(document.getElementById('currentDeployTime').value),
    plannedSites: parseFloat(document.getElementById('plannedSites').value),
    itDailyCost: parseFloat(document.getElementById('itDailyCost').value),
    prodDelayCost: parseFloat(document.getElementById('prodDelayCost').value)
  };
}

function clamp(num, min, max) {
  if (isNaN(num)) return min;
  if (num < min) return min;
  if (num > max) return max;
  return num;
}

function safePercent(numerator, denominator) {
  if (!denominator || denominator === 0) return 0;
  return (numerator / denominator) * 100;
}

function performCalculations(d) {
  var results = {};

  // --- SECURITY ---
  var competitorTotalCost = 0;
  d.competitorTools.forEach(function (tool) {
    competitorTotalCost += (tool.cost || 0);
  });

  var vcfSecurityCoverage = clamp(parseFloat(d.targetSecurityCoverage), 0, 100);
  var currentCoverage = clamp(parseFloat(d.currentSecurityCoverage), 0, 100);

  var coverageImprovement = vcfSecurityCoverage - currentCoverage;

  var currentAppsProtected = Math.round(d.totalApps * (currentCoverage / 100));
  var vcfAppsProtected = Math.round(d.totalApps * (vcfSecurityCoverage / 100));
  var additionalAppsProtected = vcfAppsProtected - currentAppsProtected;
  if (additionalAppsProtected < 0) additionalAppsProtected = 0;

  var workloadImprovementPercent = null;
  if (currentAppsProtected > 0) {
    workloadImprovementPercent = Math.round((additionalAppsProtected / currentAppsProtected) * 100);
  }

  var securityCostSavings = competitorTotalCost - d.vmwareCostPerCore;
  var securityCostReduction = Math.round(safePercent(securityCostSavings, competitorTotalCost));

  var currentHosts = Math.ceil(d.totalVMs / Math.max(1, d.currentDensity));
  var totalCores = currentHosts * 128;

  var annualSecuritySavings = (totalCores * securityCostSavings) / 1000;

  var toolConsolidationSavings = (d.competitorTools.length - 1) * 0.6;
  var fteReduction = Math.max(1, Math.floor((d.securityFTEs || 0) * 0.3));
  var fteSavings = fteReduction * 0.72;

  results.security = {
    currentCoverage: currentCoverage,
    vcfCoverage: vcfSecurityCoverage,
    coverageImprovement: Math.round(coverageImprovement),
    currentApps: currentAppsProtected,
    vcfApps: vcfAppsProtected,
    additionalApps: additionalAppsProtected,
    workloadImprovementPercent: workloadImprovementPercent,

    vmwareCostPerCore: d.vmwareCostPerCore,
    competitorTotalCost: competitorTotalCost,
    competitorTools: d.competitorTools,
    costReduction: securityCostReduction,
    annualSavings: annualSecuritySavings,
    toolSavings: toolConsolidationSavings,
    fteReduction: fteReduction,
    fteSavings: fteSavings,
    totalAnnualValue: annualSecuritySavings + toolConsolidationSavings + fteSavings
  };

  // --- DR ---
  var vcfRPO = 0;
  var vcfRTO = 5;

  var rpoImprovement = 100;
  var rtoReductionHours = (d.currentRTO || 0) - (vcfRTO / 60);
  var rtoReductionPercent = safePercent(rtoReductionHours, (d.currentRTO || 1));

  var currentDRTestCost = (d.drTestFreq || 0) * (d.drTestDuration || 0) * (d.itDailyCost || 0);
  var vcfDRTestCost = (d.drTestFreq || 0) * 0.5 * (d.itDailyCost || 0);
  var drTestSavings = currentDRTestCost - vcfDRTestCost;

  var downtimeRiskReduction = rtoReductionHours * (d.downtimeCost || 0);
  var automatedRecoveryValue = (d.drTestFreq || 0) * 2 * 8 * (d.itDailyCost || 0);

  results.dr = {
    currentRPO: d.currentRPO,
    vcfRPO: vcfRPO,
    rpoImprovement: rpoImprovement,
    currentRTO: d.currentRTO,
    vcfRTO: vcfRTO,
    rtoReduction: rtoReductionPercent.toFixed(1),
    drTestSavings: drTestSavings,
    downtimeRiskReduction: downtimeRiskReduction,
    automatedRecoveryValue: automatedRecoveryValue,
    totalAnnualValue: drTestSavings + downtimeRiskReduction + automatedRecoveryValue
  };

  // --- PLATFORM ---
  var dramReduction = 0.35;
  var dramSavingsTotal = currentHosts * (d.dramPerHost || 0) * dramReduction * (d.dramCost || 0) / 1000;
  var nvmeCostTotal = currentHosts * (d.dramPerHost || 0) * dramReduction / 1024 * 1024 * (d.nvmeCost || 0) / 1000;
  var netMemorySavings = dramSavingsTotal - nvmeCostTotal;

  var vcfDensity = Math.round((d.currentDensity || 1) * 1.33);
  var densityImprovement = safePercent(vcfDensity - d.currentDensity, d.currentDensity);
  var vcfHosts = Math.ceil(d.totalVMs / Math.max(1, vcfDensity));
  var hostsReduced = currentHosts - vcfHosts;
  var hostSavings = hostsReduced * 4.8;

  results.platform = {
    currentDensity: d.currentDensity,
    vcfDensity: vcfDensity,
    densityImprovement: densityImprovement.toFixed(1),
    dramReduction: (dramReduction * 100).toFixed(0),
    dramSavings: dramSavingsTotal,
    nvmeCost: nvmeCostTotal,
    netMemorySavings: netMemorySavings,
    hostsReduced: hostsReduced,
    hostSavings: hostSavings,
    totalValue: netMemorySavings + hostSavings
  };

  // --- DEPLOYMENT ---
  var vcfDeployTime = 7;
  var timeReduction = (d.currentDeployTime || 0) - vcfDeployTime;
  var timeReductionPercent = safePercent(timeReduction, (d.currentDeployTime || 1));
  var itCostSavings = timeReduction * (d.itDailyCost || 0) * (d.plannedSites || 0);
  var timeToMarket = timeReduction * (d.prodDelayCost || 0) * (d.plannedSites || 0);

  results.deployment = {
    currentTime: d.currentDeployTime,
    vcfTime: vcfDeployTime,
    timeReduction: timeReduction,
    timeReductionPercent: timeReductionPercent.toFixed(1),
    plannedSites: d.plannedSites,
    itSavings: itCostSavings,
    timeToMarketValue: timeToMarket,
    totalValue: itCostSavings + timeToMarket
  };

  // --- SUMMARY ---
  var totalAnnualValue = results.security.totalAnnualValue + results.dr.totalAnnualValue;
  var threeYearValue = totalAnnualValue * 3 + results.platform.totalValue + results.deployment.totalValue;

  results.summary = {
    totalAnnualValue: totalAnnualValue,
    threeYearValue: threeYearValue
  };

  return results;
}

// ===== Display Results =====
function displayResults(r, d) {
  displayComparisonChart(r, d);
  displaySecurityCards(r, d);
  displayDRCards(r, d);
  displayPlatformCards(r, d);
  displayDeploymentCards(r, d);
  displayBenefits(r);
  displayROI(r);
}



function displayComparisonChart(r, d) {
  var vdefendCost = r.security.vmwareCostPerCore;
  var competitorTotal = r.security.competitorTotalCost;

  // Fix: "Higher" should be vs vDefend (same as your screenshot math)
  var higherPercent = Math.round(((competitorTotal - vdefendCost) / vdefendCost) * 100);

  // Fix: both bars share same baseline + proportional heights
  var maxCost = Math.max(vdefendCost, competitorTotal);
  var totalHeight = 440; // one shared bar area height
  var vdefendHeight = Math.max(40, (vdefendCost / maxCost) * totalHeight);
  var competitorHeight = Math.max(40, (competitorTotal / maxCost) * totalHeight);

  // No currency symbol inside chart (removes $ from screenshot areas)
  var fmt = function (n) { return new Intl.NumberFormat('en-IN').format(Math.round(n)); };

  var html = '';

  // vDefend column
  html += `<div class="vdefend-column">`;
  // html += `  <div class="vdefend-cost-label">${fmt(vdefendCost)}</div>`;
  html += `  <div class="vdefend-bar" style="height:${vdefendHeight}px">`;
  html += `    <div class="vdefend-label">vDefend</div>`;
  html += `  </div>`;
  html += `</div>`;

  // Arrow
  html += `<div class="comparison-arrow">`;
  html += `  <div class="percentage-higher">${higherPercent}%<br>Higher</div>`;
  html += `  <div class="arrow-up"></div>`;
  html += `</div>`;

  // Competitor column
  html += `<div class="competitor-column">`;
  // html += `  <div class="competitor-total-label">${fmt(competitorTotal)}</div>`;
  html += `  <div class="competitor-stack" style="height:${competitorHeight}px">`;

  var tools = r.security.competitorTools;

  // IMPORTANT: ensure layers sum exactly to competitorHeight (no Math.max() min-height)
  for (var i = 0; i < tools.length; i++) {
    var tool = tools[i];
    var layerHeight = (tool.cost / competitorTotal) * competitorHeight;

    html += `
      <div class="stack-layer"
           style="height:${layerHeight}px;background:${toolColors[i % toolColors.length]}">
        <div class="stack-layer-name">${tool.name}</div>
        <div class="stack-layer-cost"></div>
      </div>
    `;
  }

  html += `  </div>`;
  html += `</div>`;

  document.getElementById('comparisonChart').innerHTML = html;
}






function displaySecurityCards(r, d) {
  var html = '';

  html += `
    <div class="value-card highlight">
      <div class="value-card-header">
        <div class="value-card-icon">🛡️</div>
        <div class="value-card-title">Security Coverage</div>
      </div>
      <div class="value-metric success">
        +${r.security.coverageImprovement} pp
      </div>
      <div class="value-comparison">
        From ${r.security.currentCoverage}% to ${r.security.vcfCoverage}%<br>
        <strong>${r.security.additionalApps}</strong> more apps protected
        ${r.security.workloadImprovementPercent != null
          ? `<br>(${r.security.workloadImprovementPercent}% more workloads)`
          : ''}
      </div>
    </div>
  `;

  html += `
    <div class="value-card highlight">
      <div class="value-card-header">
        <div class="value-card-icon">💰</div>
        <div class="value-card-title">Cost Reduction</div>
      </div>
      <div class="value-metric success">
        -${r.security.costReduction}%
      </div>
      <div class="value-comparison">
        ${formatCurrency(r.security.vmwareCostPerCore, true)} vs ${formatCurrency(r.security.competitorTotalCost, true)}<br>
        Savings <strong>${formatCurrency(r.security.annualSavings)}/year</strong>
      </div>
    </div>
  `;

  html += `
    <div class="value-card">
      <div class="value-card-header">
        <div class="value-card-icon">🧰</div>
        <div class="value-card-title">Tool Consolidation</div>
      </div>
      <div class="value-metric warning">
        ${r.security.competitorTools.length - 1}
      </div>
      <div class="value-comparison">
        Single vDefend<br>
        Savings <strong>${formatCurrency(r.security.toolSavings)}/year</strong>
      </div>
    </div>
  `;

  html += `
    <div class="value-card">
      <div class="value-card-header">
        <div class="value-card-icon">👥</div>
        <div class="value-card-title">FTE Optimization</div>
      </div>
      <div class="value-metric">
        ${r.security.fteReduction} FTEs
      </div>
      <div class="value-comparison">
        30% reduction<br>
        Savings <strong>${formatCurrency(r.security.fteSavings)}/year</strong>
      </div>
    </div>
  `;

  document.getElementById('securityCards').innerHTML = html;

  var secTableHTML = `
    <thead>
      <tr>
        <th>Metric</th>
        <th>Current</th>
        <th>VCF 9.0</th>
        <th>Improvement</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="metric-name">Coverage</td>
        <td class="before">${r.security.currentCoverage}%</td>
        <td class="after">${r.security.vcfCoverage}%</td>
        <td class="improvement">+${r.security.coverageImprovement} pp</td>
      </tr>
      <tr>
        <td class="metric-name">Apps Protected</td>
        <td class="before">${r.security.currentApps}</td>
        <td class="after">${r.security.vcfApps}</td>
        <td class="improvement">+${r.security.additionalApps}</td>
      </tr>
      <tr>
        <td class="metric-name">Cost/Core</td>
        <td class="before">${formatCurrency(r.security.competitorTotalCost, true)}</td>
        <td class="after">${formatCurrency(r.security.vmwareCostPerCore, true)}</td>
        <td class="improvement">-${r.security.costReduction}%</td>
      </tr>
      <tr>
        <td class="metric-name">Annual Value</td>
        <td></td>
        <td></td>
        <td class="improvement">${formatCurrency(r.security.totalAnnualValue)}</td>
      </tr>
    </tbody>
  `;

  document.getElementById('securityTable').innerHTML = secTableHTML;
}

function displayDRCards(r, d) {
  var html = '';

  html += `
    <div class="value-card highlight">
      <div class="value-card-header">
        <div class="value-card-icon">🔒</div>
        <div class="value-card-title">Zero RPO</div>
      </div>
      <div class="value-metric success">
        0 min
      </div>
      <div class="value-comparison">
        From ${r.dr.currentRPO} min<br>
        <strong>100% protection</strong>
      </div>
    </div>
  `;

  html += `
    <div class="value-card highlight">
      <div class="value-card-header">
        <div class="value-card-icon">⚡</div>
        <div class="value-card-title">Instant RTO</div>
      </div>
      <div class="value-metric success">
        ${r.dr.vcfRTO} min
      </div>
      <div class="value-comparison">
        From ${r.dr.currentRTO} hrs<br>
        <strong>${r.dr.rtoReduction}% faster</strong>
      </div>
    </div>
  `;

  html += `
    <div class="value-card">
      <div class="value-card-header">
        <div class="value-card-icon">🤖</div>
        <div class="value-card-title">Automated DR</div>
      </div>
      <div class="value-metric warning">
        ${formatCurrency(r.dr.automatedRecoveryValue)}
      </div>
      <div class="value-comparison">
        Recovery automation
      </div>
    </div>
  `;

  html += `
    <div class="value-card">
      <div class="value-card-header">
        <div class="value-card-icon">📉</div>
        <div class="value-card-title">Risk Reduction</div>
      </div>
      <div class="value-metric">
        ${formatCurrency(r.dr.downtimeRiskReduction)}
      </div>
      <div class="value-comparison">
        Downtime risk
      </div>
    </div>
  `;

  document.getElementById('drCards').innerHTML = html;

  var drTableHTML = `
    <thead>
      <tr>
        <th>Metric</th>
        <th>Current</th>
        <th>VCF 9.0</th>
        <th>Improvement</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="metric-name">RPO</td>
        <td class="before">${r.dr.currentRPO} min</td>
        <td class="after">0 min</td>
        <td class="improvement">Zero data loss</td>
      </tr>
      <tr>
        <td class="metric-name">RTO</td>
        <td class="before">${r.dr.currentRTO} hrs</td>
        <td class="after">${r.dr.vcfRTO} min</td>
        <td class="improvement">Days to minutes</td>
      </tr>
      <tr>
        <td class="metric-name">Annual Value</td>
        <td></td>
        <td></td>
        <td class="improvement">${formatCurrency(r.dr.totalAnnualValue)}</td>
      </tr>
    </tbody>
  `;

  document.getElementById('drTable').innerHTML = drTableHTML;
}

function displayPlatformCards(r, d) {
  var html = '';

  html += `
    <div class="value-card highlight">
      <div class="value-card-header">
        <div class="value-card-icon">💾</div>
        <div class="value-card-title">Memory Tiering</div>
      </div>
      <div class="value-metric success">
        -${r.platform.dramReduction}%
      </div>
      <div class="value-comparison">
        DRAM reduction<br>
        Net <strong>${formatCurrency(r.platform.netMemorySavings)}</strong>
      </div>
    </div>
  `;

  html += `
    <div class="value-card highlight">
      <div class="value-card-header">
        <div class="value-card-icon">📊</div>
        <div class="value-card-title">VM Density</div>
      </div>
      <div class="value-metric success">
        +${r.platform.densityImprovement}%
      </div>
      <div class="value-comparison">
        ${r.platform.currentDensity} to ${r.platform.vcfDensity} VMs/host<br>
        <strong>${r.platform.hostsReduced} fewer hosts</strong>
      </div>
    </div>
  `;

  html += `
    <div class="value-card">
      <div class="value-card-header">
        <div class="value-card-icon">🖥️</div>
        <div class="value-card-title">Hardware Savings</div>
      </div>
      <div class="value-metric warning">
        ${formatCurrency(r.platform.hostSavings)}
      </div>
      <div class="value-comparison">
        Server reduction
      </div>
    </div>
  `;

  html += `
    <div class="value-card">
      <div class="value-card-header">
        <div class="value-card-icon">🛡️</div>
        <div class="value-card-title">Data Protection</div>
      </div>
      <div class="value-metric">
        ✓
      </div>
      <div class="value-comparison">
        Immutable snapshots
      </div>
    </div>
  `;

  document.getElementById('platformCards').innerHTML = html;

  var platTableHTML = `
    <thead>
      <tr>
        <th>Metric</th>
        <th>Current</th>
        <th>VCF 9.0</th>
        <th>Improvement</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="metric-name">VMs/Host</td>
        <td class="before">${r.platform.currentDensity}</td>
        <td class="after">${r.platform.vcfDensity}</td>
        <td class="improvement">+${r.platform.densityImprovement}%</td>
      </tr>
      <tr>
        <td class="metric-name">Total Value</td>
        <td></td>
        <td></td>
        <td class="improvement">${formatCurrency(r.platform.totalValue)}</td>
      </tr>
    </tbody>
  `;

  document.getElementById('platformTable').innerHTML = platTableHTML;
}

function displayDeploymentCards(r, d) {
  var html = '';

  html += `
    <div class="value-card highlight">
      <div class="value-card-header">
        <div class="value-card-icon">🚀</div>
        <div class="value-card-title">Deployment Speed</div>
      </div>
      <div class="value-metric success">
        -${r.deployment.timeReductionPercent}%
      </div>
      <div class="value-comparison">
        ${r.deployment.currentTime} to ${r.deployment.vcfTime} days
      </div>
    </div>
  `;

  html += `
    <div class="value-card highlight">
      <div class="value-card-header">
        <div class="value-card-icon">🏭</div>
        <div class="value-card-title">Sites Planned</div>
      </div>
      <div class="value-metric">
        ${r.deployment.plannedSites}
      </div>
      <div class="value-comparison">
        In 12 months
      </div>
    </div>
  `;

  html += `
    <div class="value-card">
      <div class="value-card-header">
        <div class="value-card-icon">💼</div>
        <div class="value-card-title">IT Savings</div>
      </div>
      <div class="value-metric warning">
        ${formatCurrency(r.deployment.itSavings)}
      </div>
      <div class="value-comparison">
        Team efficiency
      </div>
    </div>
  `;

  html += `
    <div class="value-card">
      <div class="value-card-header">
        <div class="value-card-icon">📈</div>
        <div class="value-card-title">Time-to-Market</div>
      </div>
      <div class="value-metric">
        ${formatCurrency(r.deployment.timeToMarketValue)}
      </div>
      <div class="value-comparison">
        Revenue acceleration
      </div>
    </div>
  `;

  document.getElementById('deploymentCards').innerHTML = html;

  var depTableHTML = `
    <thead>
      <tr>
        <th>Metric</th>
        <th>Current</th>
        <th>VCF 9.0</th>
        <th>Improvement</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="metric-name">Deploy Time</td>
        <td class="before">${r.deployment.currentTime} days</td>
        <td class="after">${r.deployment.vcfTime} days</td>
        <td class="improvement">-${r.deployment.timeReduction} days</td>
      </tr>
      <tr>
        <td class="metric-name">Business Value</td>
        <td></td>
        <td></td>
        <td class="improvement">${formatCurrency(r.deployment.totalValue)}</td>
      </tr>
    </tbody>
  `;

  document.getElementById('deploymentTable').innerHTML = depTableHTML;
}

function displayBenefits(r) {
  var html = '<h3>Key Benefits</h3><div class="benefit-list">';

  html += `
    <div class="benefit-item">
      <div class="benefit-icon">🛡️</div>
      <div class="benefit-text">
        <strong>${
          r.security.workloadImprovementPercent != null
            ? r.security.workloadImprovementPercent + '% More Workloads Protected'
            : r.security.coverageImprovement + ' pp More Coverage'
        }</strong>
        - ${r.security.additionalApps} more apps
      </div>
    </div>
  `;

  html += `
    <div class="benefit-item">
      <div class="benefit-icon">💰</div>
      <div class="benefit-text">
        <strong>${r.security.costReduction}% Lower Cost</strong>
        - Single vDefend
      </div>
    </div>
  `;

  html += `
    <div class="benefit-item">
      <div class="benefit-icon">🔒</div>
      <div class="benefit-text">
        <strong>Zero RPO</strong>
        - Complete protection
      </div>
    </div>
  `;

  html += `
    <div class="benefit-item">
      <div class="benefit-icon">⚡</div>
      <div class="benefit-text">
        <strong>5 Min RTO</strong>
        - Instant recovery
      </div>
    </div>
  `;

  html += `
    <div class="benefit-item">
      <div class="benefit-icon">💾</div>
      <div class="benefit-text">
        <strong>35% DRAM Savings</strong>
        - Memory tiering
      </div>
    </div>
  `;

  html += `
    <div class="benefit-item">
      <div class="benefit-icon">📊</div>
      <div class="benefit-text">
        <strong>${r.platform.densityImprovement}% Density</strong>
        - ${r.platform.hostsReduced} fewer servers
      </div>
    </div>
  `;

  html += `
    <div class="benefit-item">
      <div class="benefit-icon">🚀</div>
      <div class="benefit-text">
        <strong>7 Days Deploy</strong>
        - Rapid sites
      </div>
    </div>
  `;

  html += `
    <div class="benefit-item">
      <div class="benefit-icon">🛡️</div>
      <div class="benefit-text">
        <strong>Immutable Snapshots</strong>
        - Ransomware protection
      </div>
    </div>
  `;

  html += '</div>';

  document.getElementById('benefitBanner').innerHTML = html;
}

function displayROI(r) {
  var html = '<h3>Total Business Value</h3><div class="roi-metrics">';

  html += `
    <div class="roi-metric">
      <div class="roi-metric-label">Annual Recurring Value</div>
      <div class="roi-metric-value">${formatCurrency(r.summary.totalAnnualValue)}</div>
    </div>
  `;

  html += `
    <div class="roi-metric">
      <div class="roi-metric-label">3-Year Total Value</div>
      <div class="roi-metric-value">${formatCurrency(r.summary.threeYearValue)}</div>
    </div>
  `;

  html += '</div>';

  document.getElementById('roiSummary').innerHTML = html;
}
