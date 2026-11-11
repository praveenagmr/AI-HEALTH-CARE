/**
 * AI HEALTH CARE - Unified Audit History & Voice Interaction Logs
 */
import { Router, Request, Response } from 'express';
import { db } from '../../database/db.ts';
import { SupportedLanguage } from '../../database/schema.ts';

const router = Router();

// Log voice interaction
router.post('/voice-log', (req: Request, res: Response) => {
  const { userId = 'usr-guest', speaker, language, pageContext, text } = req.body;

  if (!speaker || !text) {
    return res.status(400).json({ error: 'Speaker and text are required' });
  }

  const log = db.saveVoiceLog({
    userId,
    speaker: speaker as 'assistant' | 'user',
    language: (language as SupportedLanguage) || 'en',
    pageContext: pageContext || 'page1_auth',
    text: text.trim(),
    audioGenerated: true,
  });

  return res.json({ success: true, log });
});

// Full unified audit history for Page 5
router.get('/full', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || '';
  const phone = (req.query.phone as string) || '';

  const fullHistory = db.getFullHistory(userId, phone);
  return res.json({
    success: true,
    data: fullHistory,
    mongoStatus: db.getMongoStatus(),
  });
});

// ADMIN ROUTES: Voice Logs
router.get('/admin/voice-logs', (req: Request, res: Response) => {
  const logs = db.getVoiceLogs();
  return res.json({ success: true, logs });
});

router.put('/admin/voice-logs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateVoiceLog(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Voice log not found' });
  }
  return res.json({ success: true, log: updated });
});

router.delete('/admin/voice-logs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteVoiceLog(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Voice log not found' });
  }
  return res.json({ success: true, message: 'Voice log deleted from database' });
});

export default router;
