const PDFDocument = require('pdfkit');
const db = require('../config/database');

const tryParse = (str) => { try { return JSON.parse(str); } catch { return str; } };

const getReport = async (req, res) => {
  try {
    const sim = await db.get('SELECT s.*, u.name, u.email FROM simulations s JOIN users u ON s.user_id = u.id WHERE s.id = ?', req.params.simulationId);
    if (!sim) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, report: { ...sim, growth_projection: tryParse(sim.growth_projection), optimistic_scenario: tryParse(sim.optimistic_scenario), realistic_scenario: tryParse(sim.realistic_scenario), risk_scenario: tryParse(sim.risk_scenario), timeline: tryParse(sim.timeline), recommendations: tryParse(sim.recommendations) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const downloadPDF = async (req, res) => {
  try {
    const sim = await db.get('SELECT s.*, u.name, u.email FROM simulations s JOIN users u ON s.user_id = u.id WHERE s.id = ?', req.params.simulationId);
    if (!sim) return res.status(404).json({ success: false, message: 'Simulation not found' });

    const optimistic = tryParse(sim.optimistic_scenario);
    const realistic = tryParse(sim.realistic_scenario);
    const riskData = tryParse(sim.risk_scenario);
    const timeline = tryParse(sim.timeline);
    const recs = tryParse(sim.recommendations);
    const growth = tryParse(sim.growth_projection);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=FutureMe_Report_${sim.id.slice(0, 8)}.pdf`);
    doc.pipe(res);

    // Header
    doc.rect(0, 0, 595, 80).fill('#050816');
    doc.fillColor('#00f5ff').fontSize(22).font('Helvetica-Bold').text('FutureMe AI', 50, 20);
    doc.fillColor('#a78bfa').fontSize(11).font('Helvetica').text('Personal Future Simulation Report', 50, 48);
    doc.fillColor('#888888').fontSize(9).text(`Generated: ${new Date().toLocaleDateString()}`, 400, 55, { align: 'right', width: 150 });
    doc.moveDown(3);

    const section = (title, color = '#00f5ff') => {
      doc.moveDown(0.5);
      doc.fillColor(color).fontSize(13).font('Helvetica-Bold').text(title);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(color).lineWidth(0.5).stroke();
      doc.moveDown(0.3);
    };

    const row = (label, value) => {
      doc.fillColor('#333333').fontSize(10).font('Helvetica-Bold').text(`${label}:`, 50, doc.y, { continued: true, width: 150 });
      doc.fillColor('#555555').font('Helvetica').text(` ${value || 'N/A'}`);
    };

    // User Details
    section('1. User Profile');
    row('Name', sim.name); row('Email', sim.email);
    row('Simulation Date', new Date(sim.created_at).toLocaleDateString());

    // Scores
    section('2. Score Summary', '#7c3aed');
    row('Skill Score', `${sim.skill_score}/100`);
    row('Consistency Score', `${sim.consistency_score}/100`);
    row('Career Readiness', `${sim.career_readiness_score}/100`);
    row('Risk Score', `${sim.risk_score}/100`);

    // Decision
    section('3. Decision Simulated', '#ec4899');
    doc.fillColor('#333333').fontSize(11).font('Helvetica').text(`"${sim.decision_text}"`, { indent: 10 });

    // Growth
    section('4. Growth Projection', '#10b981');
    if (growth) {
      row('3 Months', `${growth.threeMonths}/100`);
      row('6 Months', `${growth.sixMonths}/100`);
      row('1 Year', `${growth.oneYear}/100`);
      row('3 Years', `${growth.threeYears}/100`);
      row('5 Years', `${growth.fiveYears}/100`);
    }

    // Optimistic
    section('5. Optimistic Future', '#00f5ff');
    if (optimistic) {
      doc.fillColor('#333333').fontSize(10).font('Helvetica').text(optimistic.summary || '', { indent: 10 });
      doc.moveDown(0.3);
      row('Career Path', optimistic.careerPath);
      row('Growth Estimate', optimistic.growthEstimate);
      if (optimistic.opportunities?.length) {
        doc.fillColor('#333333').fontSize(10).font('Helvetica-Bold').text('Opportunities:', { indent: 10 });
        optimistic.opportunities.forEach(o => doc.fillColor('#555555').font('Helvetica').text(`  • ${o}`, { indent: 20 }));
      }
    }

    // Realistic
    section('6. Realistic Future', '#f59e0b');
    if (realistic) {
      doc.fillColor('#333333').fontSize(10).font('Helvetica').text(realistic.summary || '', { indent: 10 });
      doc.moveDown(0.3);
      row('Expected Progress', realistic.expectedProgress);
    }

    // Risk
    section('7. Risk Scenario', '#ef4444');
    if (riskData) {
      doc.fillColor('#333333').fontSize(10).font('Helvetica').text(riskData.summary || '', { indent: 10 });
      doc.moveDown(0.3);
      row('Risk Level', riskData.riskLevel);
      if (riskData.recoveryStrategy?.length) {
        doc.fillColor('#333333').fontSize(10).font('Helvetica-Bold').text('Recovery Strategy:', { indent: 10 });
        riskData.recoveryStrategy.forEach(r => doc.fillColor('#555555').font('Helvetica').text(`  • ${r}`, { indent: 20 }));
      }
    }

    // Timeline
    section('8. Future Timeline', '#7c3aed');
    if (Array.isArray(timeline)) {
      timeline.forEach(t => {
        doc.fillColor('#333333').fontSize(10).font('Helvetica-Bold').text(`${t.period}: `, { continued: true, indent: 10 });
        doc.fillColor('#555555').font('Helvetica').text(`Skill ${t.skillLevel}/100 – ${t.focus}`);
      });
    }

    // Recommendations
    section('9. Recommendations', '#10b981');
    if (recs) {
      if (recs.skills?.length) { doc.fillColor('#333333').fontSize(10).font('Helvetica-Bold').text('Skills to Learn:', { indent: 10 }); recs.skills.slice(0, 5).forEach(s => doc.fillColor('#555555').font('Helvetica').text(`  • ${s}`, { indent: 20 })); }
      if (recs.courses?.length) { doc.moveDown(0.3); doc.fillColor('#333333').fontSize(10).font('Helvetica-Bold').text('Recommended Courses:', { indent: 10 }); recs.courses.slice(0, 5).forEach(c => doc.fillColor('#555555').font('Helvetica').text(`  • ${c}`, { indent: 20 })); }
      if (recs.careerPaths?.length) { doc.moveDown(0.3); doc.fillColor('#333333').fontSize(10).font('Helvetica-Bold').text('Career Paths:', { indent: 10 }); recs.careerPaths.slice(0, 4).forEach(c => doc.fillColor('#555555').font('Helvetica').text(`  • ${c}`, { indent: 20 })); }
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).fillColor('#999999').text('FutureMe AI – AI-Assisted Decision Support System | This is a simulation based on your inputs, not a real-world prediction.', { align: 'center' });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const downloadCSV = async (req, res) => {
  try {
    const sim = await db.get('SELECT * FROM simulations WHERE id = ?', req.params.simulationId);
    if (!sim) return res.status(404).json({ success: false, message: 'Simulation not found' });

    const csvHeaders = 'Decision,Skill Score,Consistency Score,Career Readiness Score,Risk Score,Created Date\n';
    const csvRow = `"${sim.decision_text}",${sim.skill_score},${sim.consistency_score},${sim.career_readiness_score},${sim.risk_score},"${new Date(sim.created_at).toLocaleDateString()}"`;
    const csv = csvHeaders + csvRow;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=FutureMe_Report_${sim.id.slice(0, 8)}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getReport, downloadPDF, downloadCSV };
