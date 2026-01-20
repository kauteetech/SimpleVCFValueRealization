// Global state
var toolColors = [
    'linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)',
    'linear-gradient(180deg, #FF9800 0%, #F57C00 100%)',
    'linear-gradient(180deg, #FFB74D 0%, #FF9800 100%)',
    'linear-gradient(180deg, #E91E63 0%, #C2185B 100%)',
    'linear-gradient(180deg, #F44336 0%, #D32F2F 100%)'
];

document.addEventListener('DOMContentLoaded', function() {
    updateCompetitorTools();
});

function formatCurrency(num, isPerCore = false) {
    var symbol = '$';

    if (isPerCore) {
        return symbol + new Intl.NumberFormat('en-IN').format(Math.round(num));
    } else {
        // For USD, use American units (K for thousands, M for millions)
        if (num >= 1000) {
            // Convert to millions
            return symbol + (num / 1000).toFixed(2) + 'M';
        } else {
            // Keep as thousands
            return symbol + num.toFixed(2) + 'K';
        }
    }
}

function updateCompetitorTools() {
    var numTools = parseInt(document.getElementById('numCompetitorTools').value);
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
                           value="${defaultNames[i] || 'Product ' + (i + 1)}" 
                           placeholder="e.g., Firewall, IDS/IPS, NDR">
                </div>
                <div class="form-group">
                    <label class="form-label">Cost per Core ($)</label>
                    <input type="number" class="form-input competitor-tool-cost" 
                           value="${defaultCosts[i] || 12}" min="1" step="1">
                </div>
            </div>
        `;
        container.appendChild(toolDiv);
    }
}

function showHelp(section) {
    var helpData = {
        'infrastructure': {
            title: 'Infrastructure Baseline',
            content: `
                <div class="help-section">
                    <h4>📊 Purpose</h4>
                    <p>Establishes your environment size for all calculations. These inputs determine host counts, core counts, and application coverage.</p>

                    <h4>🔢 How Values Are Used</h4>

                    <p><strong>Total Hosts Calculation:</strong><br>
                    Hosts Needed = Total VMs ÷ VMs per Host<br>
                    <em>Example: 1,000 VMs ÷ 15 VMs/host = 67 hosts (rounded up)</em></p>

                    <p><strong>Total Cores Calculation:</strong><br>
                    Total Cores = Hosts × 128 cores per host (standard 2x64 core servers)<br>
                    <em>Example: 67 hosts × 128 = 8,576 cores</em></p>

                    <p><strong>Application Coverage:</strong><br>
                    Protected Apps = Total Apps × Security Coverage %<br>
                    <em>Example: 500 apps × 40% = 200 apps currently protected</em></p>

                    <h4>✅ Best Practices</h4>
                    <ul>
                        <li><strong>Total Applications:</strong> Count all production workloads, not just VMs</li>
                        <li><strong>VMs per Host:</strong> Use average density across your clusters</li>
                        <li><strong>Number of Datacenters:</strong> Count production DCs only (exclude dev/test)</li>
                    </ul>
                </div>
            `
        },
        'security': {
        title: 'Zero Trust Architecture (vDefend)',
        content: (() => {
            // Read current form inputs (fallbacks keep modal working even if field missing)
            var currentCov = parseFloat(document.getElementById('currentSecurityCoverage')?.value);
            if (isNaN(currentCov)) currentCov = 40;

            var uplift = parseFloat(document.getElementById('coverageUplift')?.value);
            if (isNaN(uplift)) uplift = 67;

            // Same logic as calculator: VCF coverage = current × (1 + uplift%)
            var vcfCov = Math.round(currentCov * (1 + uplift / 100));
            if (vcfCov > 100) vcfCov = 100;

            var ppImprovement = Math.max(0, Math.round(vcfCov - currentCov));

            return `
            <div class="help-section">
                <h4>🔐 Security Coverage Improvement</h4>
                <p><strong>Formula:</strong> VCF Coverage = Current Coverage × (1 + Uplift% / 100)</p>
                <p><strong>Uplift%:</strong> User input (currently set to ${uplift}%)</p>
                <p><strong>Why uplift?</strong> VMware NSX covers both east-west (lateral) AND north-south (perimeter) traffic. Traditional tools only cover perimeter.</p>
                <p><em>Example: ${currentCov}% coverage → ${vcfCov}% with VCF = ${ppImprovement} percentage points improvement</em></p>

                <h4>💰 Cost per Core Reduction</h4>
                <p><strong>Formula:</strong> VCF Cost = Current Cost × 0.476 (52.4% reduction)</p>
                <p><strong>Annual Savings:</strong><br>
                Savings per Core = Current Cost - VCF Cost<br>
                Total Savings = Savings per Core × Total Cores</p>
                <p><em>Example: ($15,000 - $7,140) × 8,576 cores = $674K/year</em></p>

                <h4>🔧 Tool Consolidation</h4>
                <p><strong>Formula:</strong> Savings = (Number of Tools - 1) × $50K per tool/year</p>
                <p>VCF eliminates separate L7 Firewall, IDPS, and ATP products into one unified platform.</p>
                <p><em>Example: 3 tools → 1 tool = 2 eliminated × $50K = $100K/year saved</em></p>

                <h4>👥 FTE Optimization</h4>
                <p><strong>Formula:</strong> FTEs Reduced = Current FTEs × 30% (automation factor)</p>
                <p><strong>Annual Savings:</strong> FTEs Reduced × $60K per FTE/year</p>
                <p><em>Example: 4 FTEs × 30% = 1.2 FTEs → 1 FTE × $60K = $60K/year</em></p>
            </div>
            `;
        })()
        },
        'dr': {
            title: 'Active-Active DC & DR',
            content: `
                <div class="help-section">
                    <h4>💾 RPO (Recovery Point Objective)</h4>
                    <p><strong>Formula:</strong> VCF RPO = 0 minutes (Stretch Clusters provide zero data loss)</p>
                    <p><strong>Improvement:</strong> (Current RPO - 0) / Current RPO × 100%</p>
                    <p><em>Example: 60 minutes → 0 minutes = 100% improvement</em></p>

                    <h4>⏱️ RTO (Recovery Time Objective)</h4>
                    <p><strong>Formula:</strong> VCF RTO = 5 minutes (automated failover)</p>
                    <p><strong>Improvement:</strong> (Current RTO - 5 min) / Current RTO × 100%</p>
                    <p><em>Example: 8 hours (480 min) → 5 min = 99% faster recovery</em></p>

                    <h4>🧪 DR Testing Savings</h4>
                    <p><strong>Current Cost:</strong> Tests/Year × Test Duration (days) × IT Daily Cost<br>
                    <strong>VCF Cost:</strong> Tests/Year × 0.5 days × IT Daily Cost<br>
                    <strong>Savings:</strong> Current Cost - VCF Cost</p>
                    <p><em>Example: 2 tests × 3 days × $2K = $12K/year<br>
                    VCF: 2 tests × 0.5 days × $2K = $2K/year<br>
                    Savings: $10K/year</em></p>

                    <h4>⚠️ Downtime Risk Reduction</h4>
                    <p><strong>Formula:</strong> Hours Saved = Current RTO - VCF RTO<br>
                    <strong>Annual Value:</strong> Hours Saved × Downtime Cost/Hour × Expected Incidents/Year</p>
                    <p><em>Example: (8 hours - 0.083 hours) × $50K/hour × 1 incident = $395K/year</em></p>
                </div>
            `
        },
        'platform': {
            title: 'Platform Efficiency',
            content: `
                <div class="help-section">
                    <h4>💾 Memory Tiering Savings</h4>
                    <p><strong>DRAM Reduction:</strong> 35% using 1:1 DRAM:NVMe memory tiering</p>

                    <p><strong>DRAM Savings Calculation:</strong><br>
                    DRAM Saved per Host = DRAM per Host × 35%<br>
                    Total DRAM Savings = DRAM Saved × DRAM Cost/GB × Number of Hosts</p>
                    <p><em>Example: 2,048 GB × 35% = 716.8 GB saved per host<br>
                    716.8 GB × $3,000/GB × 67 hosts = $1,440K</em></p>

                    <p><strong>Net Savings:</strong> DRAM Savings - NVMe Cost<br>
                    <em>Example: $1,440K - $95.8K = $1,344K (one-time CapEx)</em></p>

                    <h4>📈 VM Density Improvement</h4>
                    <p><strong>Formula:</strong> VCF Density = Current Density × 1.33 (33% improvement)</p>
                    <p><strong>Hosts Reduced:</strong> Total VMs ÷ Current Density - Total VMs ÷ VCF Density<br>
                    <strong>Savings:</strong> Hosts Reduced × $40K per host</p>
                    <p><em>Example: 15 VMs/host → 20 VMs/host<br>
                    1,000 VMs = 67 hosts → 50 hosts = 17 hosts saved<br>
                    17 × $40K = $680K (one-time CapEx)</em></p>
                </div>
            `
        },
        'deployment': {
            title: 'Rapid Deployment',
            content: `
                <div class="help-section">
                    <h4>⚡ Deployment Time Reduction</h4>
                    <p><strong>Formula:</strong> VCF Deployment = 7 days (Cloud Builder automation)</p>
                    <p><strong>Time Saved:</strong> Current Time - 7 days<br>
                    <strong>Percentage:</strong> (Time Saved / Current Time) × 100%</p>
                    <p><em>Example: 90 days → 7 days = 83 days saved (92% faster)</em></p>

                    <h4>💼 IT Cost Savings</h4>
                    <p><strong>Formula:</strong> IT Savings per Site = Time Saved (days) × IT Daily Cost</p>
                    <p><strong>Total Savings:</strong> IT Savings per Site × Number of Planned Sites</p>
                    <p><em>Example: 83 days × $2K/day = $166K per site<br>
                    5 sites × $166K = $830K (total IT savings)</em></p>

                    <h4>🚀 Time-to-Market Value</h4>
                    <p><strong>Formula:</strong> Revenue Delay per Site = Time Saved × Production Delay Cost/day</p>
                    <p><strong>Total Value:</strong> Revenue Delay per Site × Number of Sites</p>
                    <p><em>Example: 83 days × $10K/day = $830K per site<br>
                    5 sites × $830K = $4,150K in faster time-to-market</em></p>
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
        modal.classList.add('active');
    }
}

function closeHelp() {
    document.getElementById('helpModal').classList.remove('active');
}

window.onclick = function(event) {
    var helpModal = document.getElementById('helpModal');

    if (event.target == helpModal) {
        closeHelp();
    }
};

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
            name: toolNames[i].value || ('Product ' + (i + 1)),
            cost: parseInt(toolCosts[i].value) || 0
        });
    }

    return {
        totalApps: parseInt(document.getElementById('totalApps').value),
        totalVMs: parseInt(document.getElementById('totalVMs').value),
        currentDensity: parseInt(document.getElementById('currentDensity').value),
        numDCs: parseInt(document.getElementById('numDCs').value),
        vmwareCostPerCore: parseInt(document.getElementById('vmwareCostPerCore').value),
        currentSecurityCoverage: parseInt(document.getElementById('currentSecurityCoverage').value),
        competitorTools: competitorTools,
        securityFTEs: parseInt(document.getElementById('securityFTEs').value),
        currentRPO: parseInt(document.getElementById('currentRPO').value),
        currentRTO: parseInt(document.getElementById('currentRTO').value),
        drTestFreq: parseInt(document.getElementById('drTestFreq').value),
        drTestDuration: parseInt(document.getElementById('drTestDuration').value),
        downtimeCost: parseFloat(document.getElementById('downtimeCost').value),
        dramPerHost: parseInt(document.getElementById('dramPerHost').value),
        dramCost: parseFloat(document.getElementById('dramCost').value),
        nvmePerHost: parseInt(document.getElementById('nvmePerHost').value),
        nvmeCost: parseFloat(document.getElementById('nvmeCost').value),
        currentDeployTime: parseInt(document.getElementById('currentDeployTime').value),
        plannedSites: parseInt(document.getElementById('plannedSites').value),
        itDailyCost: parseFloat(document.getElementById('itDailyCost').value),
        prodDelayCost: parseFloat(document.getElementById('prodDelayCost').value),
        coverageUplift: parseFloat(document.getElementById('coverageUplift').value)

    };
}

function performCalculations(d) {
    var results = {};

    // Security Calculations
    var competitorTotalCost = 0;
    d.competitorTools.forEach(function(tool) {
        competitorTotalCost += tool.cost;
    });

    var vcfSecurityCoverage = Math.round(d.currentSecurityCoverage * (1 + (d.coverageUplift / 100)));
    if (vcfSecurityCoverage > 100) vcfSecurityCoverage = 100;

    var coverageImprovement = vcfSecurityCoverage - d.currentSecurityCoverage;
    var additionalAppsProtected = Math.round(d.totalApps * (coverageImprovement / 100));
    var securityCostSavings = competitorTotalCost - d.vmwareCostPerCore;
    var securityCostReduction = Math.round((securityCostSavings / competitorTotalCost) * 100);

    var currentHosts = Math.ceil(d.totalVMs / d.currentDensity);
    var totalCores = currentHosts * 128;
    var annualSecuritySavings = (totalCores * securityCostSavings) / 1000;

    var toolConsolidationSavings = (d.competitorTools.length - 1) * 0.6;
    var fteReduction = Math.max(1, Math.floor(d.securityFTEs * 0.3));
    var fteSavings = fteReduction * 0.72;

    results.security = {
        currentCoverage: d.currentSecurityCoverage,
        vcfCoverage: vcfSecurityCoverage,
        coverageImprovement: coverageImprovement,
        additionalApps: additionalAppsProtected,
        vmwareCostPerCore: d.vmwareCostPerCore,
        competitorTotalCost: competitorTotalCost,
        competitorTools: d.competitorTools,
        costReduction: securityCostReduction,
        annualSavings: annualSecuritySavings,
        toolsConsolidated: d.competitorTools.length - 1,
        toolSavings: toolConsolidationSavings,
        fteReduction: fteReduction,
        fteSavings: fteSavings,
        totalAnnualValue: annualSecuritySavings + toolConsolidationSavings + fteSavings
    };

    // DR Calculations
    var vcfRPO = 0, vcfRTO = 5;
    var rpoImprovement = ((d.currentRPO - vcfRPO) / d.currentRPO * 100).toFixed(1);
    var rtoReduction = ((d.currentRTO - (vcfRTO/60)) / d.currentRTO * 100).toFixed(1);

    var currentDRTestCost = d.drTestFreq * d.drTestDuration * d.itDailyCost;
    var vcfDRTestCost = d.drTestFreq * 0.5 * d.itDailyCost;
    var drTestSavings = currentDRTestCost - vcfDRTestCost;

    var downtimeRiskReduction = (d.currentRTO - (vcfRTO/60)) * d.downtimeCost;
    var automatedRecoveryValue = d.drTestFreq * 2 * 8 * d.itDailyCost;

    results.dr = {
        currentRPO: d.currentRPO,
        vcfRPO: vcfRPO,
        rpoImprovement: rpoImprovement,
        currentRTO: d.currentRTO,
        vcfRTO: vcfRTO,
        rtoReduction: rtoReduction,
        drTestSavings: drTestSavings,
        downtimeRiskReduction: downtimeRiskReduction,
        automatedRecoveryValue: automatedRecoveryValue,
        totalAnnualValue: drTestSavings + downtimeRiskReduction + automatedRecoveryValue
    };

    // Platform Efficiency Calculations
    var dramReduction = 0.35;
    var dramSavingsTotal = (currentHosts * d.dramPerHost * dramReduction * d.dramCost) / 1000;
    var nvmeCostTotal = (currentHosts * d.dramPerHost * dramReduction / 1024 / 1024 * d.nvmeCost) / 1000;
    var netMemorySavings = dramSavingsTotal - nvmeCostTotal;

    var vcfDensity = Math.round(d.currentDensity * 1.33);
    var densityImprovement = (((vcfDensity - d.currentDensity) / d.currentDensity) * 100).toFixed(1);
    var vcfHosts = Math.ceil(d.totalVMs / vcfDensity);
    var hostsReduced = currentHosts - vcfHosts;
    var hostSavings = hostsReduced * 4.8;

    results.platform = {
        currentDensity: d.currentDensity,
        vcfDensity: vcfDensity,
        densityImprovement: densityImprovement,
        dramReduction: (dramReduction * 100).toFixed(0),
        dramSavings: dramSavingsTotal,
        nvmeCost: nvmeCostTotal,
        netMemorySavings: netMemorySavings,
        hostsReduced: hostsReduced,
        hostSavings: hostSavings,
        totalValue: netMemorySavings + hostSavings
    };

    // Deployment Calculations
    var vcfDeployTime = 7;
    var timeReduction = d.currentDeployTime - vcfDeployTime;
    var timeReductionPercent = ((timeReduction / d.currentDeployTime) * 100).toFixed(1);
    var itCostSavings = timeReduction * d.itDailyCost * d.plannedSites;
    var timeToMarket = timeReduction * d.prodDelayCost * d.plannedSites;

    results.deployment = {
        currentTime: d.currentDeployTime,
        vcfTime: vcfDeployTime,
        timeReduction: timeReduction,
        timeReductionPercent: timeReductionPercent,
        plannedSites: d.plannedSites,
        itSavings: itCostSavings,
        timeToMarketValue: timeToMarket,
        totalValue: itCostSavings + timeToMarket
    };

    // Summary
    var totalAnnualValue = results.security.totalAnnualValue + results.dr.totalAnnualValue;
    var threeYearValue = totalAnnualValue * 3 + results.platform.totalValue + results.deployment.totalValue;

    results.summary = {
        totalAnnualValue: totalAnnualValue,
        threeYearValue: threeYearValue
    };

    return results;
}

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
    var savingsPercent = Math.round(((competitorTotal - vdefendCost) / vdefendCost) * 100);

    var html = '<div class="vdefend-column">';
    html += '<div class="vdefend-bar">';
    html += '<div class="vdefend-label">vDefend</div>';
    html += '<div class="vdefend-price">$' + new Intl.NumberFormat('en-IN').format(Math.round(vdefendCost)) + '/core</div>';
    html += '</div></div>';

    html += '<div class="comparison-arrow">';
    html += '<div class="percentage-higher">' + savingsPercent + '%<br>Higher</div>';
    html += '<div class="arrow-up"></div>';
    html += '</div>';

    html += '<div class="competitor-column">';
    html += '<div class="competitor-stack">';

    var totalHeight = 440;
    var tools = r.security.competitorTools;
    for (var i = 0; i < tools.length; i++) {
        var tool = tools[i];
        var heightPercent = (tool.cost / competitorTotal) * 100;
        var height = Math.max(50, (totalHeight * heightPercent) / 100);
        html += '<div class="stack-layer" style="height: ' + height + 'px; background: ' + toolColors[i % toolColors.length] + '">';
        html += '<div class="stack-layer-name">' + tool.name + '</div>';
        html += '</div>';
    }
    html += '</div></div>';

    document.getElementById('comparisonChart').innerHTML = html;
}

function displaySecurityCards(r, d) {
    var html = '';

    html += '<div class="value-card highlight">';
    html += '<div class="value-card-header"><div class="value-card-icon">🛡️</div><div class="value-card-title">Security Coverage</div></div>';
    html += '<div class="value-metric success">+' + r.security.coverageImprovement + '%</div>';
    html += '<div class="value-comparison">From ' + r.security.currentCoverage + '% to ' + r.security.vcfCoverage + '%<br><strong>' + r.security.additionalApps + '</strong> more apps</div>';
    html += '</div>';

    html += '<div class="value-card highlight">';
    html += '<div class="value-card-header"><div class="value-card-icon">💰</div><div class="value-card-title">Cost Reduction</div></div>';
    html += '<div class="value-metric success">-' + r.security.costReduction + '%</div>';
    html += '<div class="value-comparison">' + formatCurrency(r.security.vmwareCostPerCore, true) + ' vs ' + formatCurrency(r.security.competitorTotalCost, true) + '<br>Savings: <strong>' + formatCurrency(r.security.annualSavings) + '/year</strong></div>';
    html += '</div>';

    html += '<div class="value-card">';
    html += '<div class="value-card-header"><div class="value-card-icon">🔧</div><div class="value-card-title">Tool Consolidation</div></div>';
    html += '<div class="value-metric warning">-' + (r.security.competitorTools.length - 1) + '</div>';
    html += '<div class="value-comparison">Single vDefend<br>Savings: <strong>' + formatCurrency(r.security.toolSavings) + '/year</strong></div>';
    html += '</div>';

    html += '<div class="value-card">';
    html += '<div class="value-card-header"><div class="value-card-icon">👥</div><div class="value-card-title">FTE Optimization</div></div>';
    html += '<div class="value-metric">-' + r.security.fteReduction + ' FTEs</div>';
    html += '<div class="value-comparison">30% reduction<br>Savings: <strong>' + formatCurrency(r.security.fteSavings) + '/year</strong></div>';
    html += '</div>';

    document.getElementById('securityCards').innerHTML = html;

    var secTableHTML = '<thead><tr><th>Metric</th><th>Current</th><th>VCF 9.0</th><th>Improvement</th></tr></thead><tbody>';
    secTableHTML += '<tr><td class="metric-name">Coverage</td><td class="before">' + r.security.currentCoverage + '%</td><td class="after">' + r.security.vcfCoverage + '%</td><td class="improvement">+' + r.security.coverageImprovement + '%</td></tr>';
    secTableHTML += '<tr><td class="metric-name">Cost/Core</td><td class="before">' + formatCurrency(r.security.competitorTotalCost, true) + '</td><td class="after">' + formatCurrency(r.security.vmwareCostPerCore, true) + '</td><td class="improvement">-' + r.security.costReduction + '%</td></tr>';
    secTableHTML += '<tr><td class="metric-name">Annual Value</td><td></td><td></td><td class="improvement">' + formatCurrency(r.security.totalAnnualValue) + '</td></tr></tbody>';
    document.getElementById('securityTable').innerHTML = secTableHTML;
}

function displayDRCards(r, d) {
    var html = '';

    html += '<div class="value-card highlight">';
    html += '<div class="value-card-header"><div class="value-card-icon">💾</div><div class="value-card-title">Zero RPO</div></div>';
    html += '<div class="value-metric success">0 min</div>';
    html += '<div class="value-comparison">From ' + r.dr.currentRPO + ' min<br><strong>100% protection</strong></div>';
    html += '</div>';

    html += '<div class="value-card highlight">';
    html += '<div class="value-card-header"><div class="value-card-icon">⏱️</div><div class="value-card-title">Instant RTO</div></div>';
    html += '<div class="value-metric success">' + r.dr.vcfRTO + ' min</div>';
    html += '<div class="value-comparison">From ' + r.dr.currentRTO + ' hrs<br><strong>' + r.dr.rtoReduction + '% faster</strong></div>';
    html += '</div>';

    html += '<div class="value-card">';
    html += '<div class="value-card-header"><div class="value-card-icon">🤖</div><div class="value-card-title">Automated DR</div></div>';
    html += '<div class="value-metric warning">' + formatCurrency(r.dr.automatedRecoveryValue) + '</div>';
    html += '<div class="value-comparison">Recovery automation</div>';
    html += '</div>';

    html += '<div class="value-card">';
    html += '<div class="value-card-header"><div class="value-card-icon">⚠️</div><div class="value-card-title">Risk Reduction</div></div>';
    html += '<div class="value-metric">' + formatCurrency(r.dr.downtimeRiskReduction) + '</div>';
    html += '<div class="value-comparison">Downtime risk</div>';
    html += '</div>';

    document.getElementById('drCards').innerHTML = html;

    var drTableHTML = '<thead><tr><th>Metric</th><th>Current</th><th>VCF 9.0</th><th>Improvement</th></tr></thead><tbody>';
    drTableHTML += '<tr><td class="metric-name">RPO</td><td class="before">' + r.dr.currentRPO + ' min</td><td class="after">0 min</td><td class="improvement">Zero data loss</td></tr>';
    drTableHTML += '<tr><td class="metric-name">RTO</td><td class="before">' + r.dr.currentRTO + ' hrs</td><td class="after">' + r.dr.vcfRTO + ' min</td><td class="improvement">Days to minutes</td></tr>';
    drTableHTML += '<tr><td class="metric-name">Annual Value</td><td></td><td></td><td class="improvement">' + formatCurrency(r.dr.totalAnnualValue) + '</td></tr></tbody>';
    document.getElementById('drTable').innerHTML = drTableHTML;
}

function displayPlatformCards(r, d) {
    var html = '';

    html += '<div class="value-card highlight">';
    html += '<div class="value-card-header"><div class="value-card-icon">💾</div><div class="value-card-title">Memory Tiering</div></div>';
    html += '<div class="value-metric success">-' + r.platform.dramReduction + '%</div>';
    html += '<div class="value-comparison">DRAM reduction<br>Net: <strong>' + formatCurrency(r.platform.netMemorySavings) + '</strong></div>';
    html += '</div>';

    html += '<div class="value-card highlight">';
    html += '<div class="value-card-header"><div class="value-card-icon">📊</div><div class="value-card-title">VM Density</div></div>';
    html += '<div class="value-metric success">+' + r.platform.densityImprovement + '%</div>';
    html += '<div class="value-comparison">' + r.platform.currentDensity + ' to ' + r.platform.vcfDensity + ' VMs/host<br><strong>' + r.platform.hostsReduced + ' fewer hosts</strong></div>';
    html += '</div>';

    html += '<div class="value-card">';
    html += '<div class="value-card-header"><div class="value-card-icon">🖥️</div><div class="value-card-title">Hardware Savings</div></div>';
    html += '<div class="value-metric warning">' + formatCurrency(r.platform.hostSavings) + '</div>';
    html += '<div class="value-comparison">Server reduction</div>';
    html += '</div>';

    html += '<div class="value-card">';
    html += '<div class="value-card-header"><div class="value-card-icon">🔐</div><div class="value-card-title">Data Protection</div></div>';
    html += '<div class="value-metric">✅</div>';
    html += '<div class="value-comparison">Immutable snapshots</div>';
    html += '</div>';

    document.getElementById('platformCards').innerHTML = html;

    var platTableHTML = '<thead><tr><th>Metric</th><th>Current</th><th>VCF 9.0</th><th>Improvement</th></tr></thead><tbody>';
    platTableHTML += '<tr><td class="metric-name">VMs/Host</td><td class="before">' + r.platform.currentDensity + '</td><td class="after">' + r.platform.vcfDensity + '</td><td class="improvement">+' + r.platform.densityImprovement + '%</td></tr>';
    platTableHTML += '<tr><td class="metric-name">Total Value</td><td></td><td></td><td class="improvement">' + formatCurrency(r.platform.totalValue) + '</td></tr></tbody>';
    document.getElementById('platformTable').innerHTML = platTableHTML;
}

function displayDeploymentCards(r, d) {
    var html = '';

    html += '<div class="value-card highlight">';
    html += '<div class="value-card-header"><div class="value-card-icon">⚡</div><div class="value-card-title">Deployment Speed</div></div>';
    html += '<div class="value-metric success">-' + r.deployment.timeReductionPercent + '%</div>';
    html += '<div class="value-comparison">' + r.deployment.currentTime + ' to ' + r.deployment.vcfTime + ' days</div>';
    html += '</div>';

    html += '<div class="value-card highlight">';
    html += '<div class="value-card-header"><div class="value-card-icon">🏭</div><div class="value-card-title">Sites Planned</div></div>';
    html += '<div class="value-metric">' + r.deployment.plannedSites + '</div>';
    html += '<div class="value-comparison">In 12 months</div>';
    html += '</div>';

    html += '<div class="value-card">';
    html += '<div class="value-card-header"><div class="value-card-icon">💼</div><div class="value-card-title">IT Savings</div></div>';
    html += '<div class="value-metric warning">' + formatCurrency(r.deployment.itSavings) + '</div>';
    html += '<div class="value-comparison">Team efficiency</div>';
    html += '</div>';

    html += '<div class="value-card">';
    html += '<div class="value-card-header"><div class="value-card-icon">🚀</div><div class="value-card-title">Time-to-Market</div></div>';
    html += '<div class="value-metric">' + formatCurrency(r.deployment.timeToMarketValue) + '</div>';
    html += '<div class="value-comparison">Revenue acceleration</div>';
    html += '</div>';

    document.getElementById('deploymentCards').innerHTML = html;

    var depTableHTML = '<thead><tr><th>Metric</th><th>Current</th><th>VCF 9.0</th><th>Improvement</th></tr></thead><tbody>';
    depTableHTML += '<tr><td class="metric-name">Deploy Time</td><td class="before">' + r.deployment.currentTime + ' days</td><td class="after">' + r.deployment.vcfTime + ' days</td><td class="improvement">-' + r.deployment.timeReduction + ' days</td></tr>';
    depTableHTML += '<tr><td class="metric-name">Business Value</td><td></td><td></td><td class="improvement">' + formatCurrency(r.deployment.totalValue) + '</td></tr></tbody>';
    document.getElementById('deploymentTable').innerHTML = depTableHTML;
}

function displayBenefits(r) {
    var html = '<h3>Key Benefits</h3><div class="benefit-list">';

    html += '<div class="benefit-item"><div class="benefit-icon">✅</div><div class="benefit-text"><strong>67% More Coverage</strong> - ' + r.security.additionalApps + ' more apps</div></div>';
    html += '<div class="benefit-item"><div class="benefit-icon">💰</div><div class="benefit-text"><strong>' + r.security.costReduction + '% Lower Cost</strong> - Single vDefend</div></div>';
    html += '<div class="benefit-item"><div class="benefit-icon">💾</div><div class="benefit-text"><strong>Zero RPO</strong> - Complete protection</div></div>';
    html += '<div class="benefit-item"><div class="benefit-icon">⏱️</div><div class="benefit-text"><strong>5 Min RTO</strong> - Instant recovery</div></div>';
    html += '<div class="benefit-item"><div class="benefit-icon">📉</div><div class="benefit-text"><strong>35% DRAM Savings</strong> - Memory tiering</div></div>';
    html += '<div class="benefit-item"><div class="benefit-icon">📊</div><div class="benefit-text"><strong>+' + r.platform.densityImprovement + '% Density</strong> - ' + r.platform.hostsReduced + ' fewer servers</div></div>';
    html += '<div class="benefit-item"><div class="benefit-icon">⚡</div><div class="benefit-text"><strong>7 Days Deploy</strong> - Rapid sites</div></div>';
    html += '<div class="benefit-item"><div class="benefit-icon">🔐</div><div class="benefit-text"><strong>Immutable Snapshots</strong> - Ransomware protection</div></div>';

    html += '</div>';
    document.getElementById('benefitBanner').innerHTML = html;
}

function displayROI(r) {
    var html = '<h3>Total Business Value</h3><div class="roi-metrics">';

    html += '<div class="roi-metric">';
    html += '<div class="roi-metric-label">Annual Recurring Value</div>';
    html += '<div class="roi-metric-value">' + formatCurrency(r.summary.totalAnnualValue) + '</div>';
    html += '</div>';

    html += '<div class="roi-metric">';
    html += '<div class="roi-metric-label">3-Year Total Value</div>';
    html += '<div class="roi-metric-value">' + formatCurrency(r.summary.threeYearValue) + '</div>';
    html += '</div>';

    html += '</div>';
    document.getElementById('roiSummary').innerHTML = html;
}
