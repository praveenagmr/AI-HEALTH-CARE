/**
 * AI HEALTH CARE - Health Screening API Routes
 */
import { Router, Request, Response } from 'express';
import { db } from '../../database/db.ts';
import { analyzeHealthSource, parseVoiceInput } from '../gemini.ts';
import { SupportedLanguage, HealthCategory } from '../../database/schema.ts';

const router = Router();

// Multimodal Health Screening (Photo and/or Report)
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const {
      userId = 'usr-guest',
      categoryHint,
      photoBase64,
      photoName,
      photoMimeType,
      reportText,
      reportName,
      userPreferredLanguage = 'en',
      symptomsDescription,
    } = req.body;

    const hasPhoto = Boolean(photoBase64 && photoBase64.length > 50);
    const hasReport = Boolean(reportText && reportText.trim().length > 10);

    const analysis = await analyzeHealthSource({
      categoryHint,
      photoBase64: hasPhoto ? photoBase64 : undefined,
      photoMimeType,
      reportText: hasReport ? reportText : undefined,
      userPreferredLanguage: userPreferredLanguage as SupportedLanguage,
      symptomsDescription,
    });

    // Save record to DB
    const saved = db.saveScreening({
      userId,
      category: (analysis.category as HealthCategory) || 'skin',
      conditionName: analysis.conditionName,
      confidenceScore: analysis.confidenceScore || 92,
      severity: analysis.severity || 'mild',
      symptomsObserved: analysis.symptomsObserved || [],
      clinicalSummary: analysis.clinicalSummary,
      localizedSummary: analysis.localizedSummary,
      hasUploadedPhoto: hasPhoto,
      photoUrl: hasPhoto ? (photoBase64.length < 500000 ? photoBase64 : 'Uploaded Medical Photo') : undefined,
      photoName,
      hasUploadedReport: hasReport,
      reportName,
      reportSummary: hasReport ? reportText.slice(0, 300) : undefined,
      voiceScreeningConducted: false,
      recommendedCare: analysis.recommendedCare || [],
    });

    return res.json({
      success: true,
      screening: saved,
      spokenSummary: saved.localizedSummary[userPreferredLanguage as SupportedLanguage] || saved.clinicalSummary,
    });
  } catch (err: any) {
    console.error('Screening route error:', err);
    return res.status(500).json({ error: err?.message || 'Screening analysis failed' });
  }
});

// Interactive AI Voice Assistant Health Screening
router.post('/voice-assessment', async (req: Request, res: Response) => {
  try {
    const {
      userId = 'usr-guest',
      category = 'skin',
      userPreferredLanguage = 'en',
      answers, // { symptomArea, durationDays, painLevel, triggers, otherDetails }
    } = req.body;

    const symptomText = `
Category: ${category}
Symptom Location / Details: ${answers?.symptomArea || 'General area'}
Duration of issue: ${answers?.durationDays || 'Few days'}
Pain / Discomfort Intensity: ${answers?.painLevel || 'Mild'}
Known triggers or previous treatments: ${answers?.triggers || 'None specified'}
Additional patient notes: ${answers?.otherDetails || 'None'}
    `.trim();

    const analysis = await analyzeHealthSource({
      categoryHint: category,
      symptomsDescription: symptomText,
      userPreferredLanguage: userPreferredLanguage as SupportedLanguage,
    });

    const saved = db.saveScreening({
      userId,
      category: (category as HealthCategory) || 'skin',
      conditionName: analysis.conditionName,
      confidenceScore: analysis.confidenceScore || 88,
      severity: analysis.severity || 'moderate',
      symptomsObserved: analysis.symptomsObserved || [],
      clinicalSummary: analysis.clinicalSummary,
      localizedSummary: analysis.localizedSummary,
      hasUploadedPhoto: false,
      hasUploadedReport: false,
      voiceScreeningConducted: true,
      questionnaireAnswers: answers,
      recommendedCare: analysis.recommendedCare || [],
    });

    return res.json({
      success: true,
      screening: saved,
      spokenSummary: saved.localizedSummary[userPreferredLanguage as SupportedLanguage] || saved.clinicalSummary,
    });
  } catch (err: any) {
    console.error('Voice assessment error:', err);
    return res.status(500).json({ error: err?.message || 'Voice assessment failed' });
  }
});

// Nearby Hospitals and Medicine Stores Geolocation API
router.get('/nearby-facilities', (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string) || 12.9716;
  const lng = parseFloat(req.query.lng as string) || 77.5946;
  const category = (req.query.category as string) || 'skin';

  const facilities = db.getNearbyFacilities(lat, lng, category);
  return res.json({
    success: true,
    userLocation: { latitude: lat, longitude: lng },
    facilities,
  });
});

// Parse speech into questionnaire answers
router.post('/parse-voice-screening', async (req: Request, res: Response) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: 'Transcript required' });
  }

  try {
    const parsed = await parseVoiceInput(transcript, 'screening');
    return res.json({ success: true, parsed });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Voice parsing failed' });
  }
});

// Screening History
router.get('/history', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const list = db.getScreenings(userId);
  return res.json({ success: true, screenings: list });
});

// ADMIN ROUTES: Screening Records
router.get('/admin/all', (req: Request, res: Response) => {
  const allScreenings = db.getScreenings();
  return res.json({ success: true, screenings: allScreenings });
});

router.put('/admin/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateScreening(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Screening not found' });
  }
  return res.json({ success: true, screening: updated });
});

router.delete('/admin/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteScreening(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Screening not found' });
  }
  return res.json({ success: true, message: 'Screening record deleted from database' });
});

export default router;
