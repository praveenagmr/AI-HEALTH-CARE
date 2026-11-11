/**
 * AI HEALTH CARE - Medicine Information & Voice-Assisted Ordering Routes
 */
import { Router, Request, Response } from 'express';
import { db } from '../../database/db.ts';
import { parseVoiceInput } from '../gemini.ts';

const router = Router();

// Get medicines (optionally filtered by category)
router.get('/list', (req: Request, res: Response) => {
  const category = req.query.category as string;
  const list = db.getMedicines(category);
  return res.json({ success: true, medicines: list });
});

// Parse voice command for medicine ordering
router.post('/parse-voice-order', async (req: Request, res: Response) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: 'Speech transcript required' });
  }

  try {
    const parsed = await parseVoiceInput(transcript, 'medicines');
    return res.json({ success: true, parsed });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Voice parsing failed' });
  }
});

// Place order (via voice assistant or manual cart) with real delivery tracking
router.post('/order', (req: Request, res: Response) => {
  const {
    userId = 'usr-guest',
    screeningId,
    items,
    deliveryAddress,
    contactPhone,
    deliveryLocation,
    paymentMethod = 'Cash on Delivery',
    orderedVia = 'voice_assistant',
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one medicine item.' });
  }

  if (!deliveryAddress || !contactPhone) {
    return res.status(400).json({ error: 'Delivery address and contact phone are required.' });
  }

  // Calculate total
  const totalAmountInr = items.reduce((acc, curr) => {
    const price = curr.medicine?.priceInr || 0;
    const qty = curr.quantity || 1;
    return acc + price * qty;
  }, 0);

  const order = db.createOrder({
    userId,
    screeningId,
    items,
    totalAmountInr,
    deliveryAddress: deliveryAddress.trim(),
    contactPhone: contactPhone.trim(),
    deliveryLocation,
    paymentMethod,
    orderedVia,
  });

  return res.status(201).json({
    success: true,
    message: 'Medicine order dispatched to verified cold-chain pharmacy with GPS live tracking.',
    order,
  });
});

// Get user orders
router.get('/orders', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const orders = db.getOrders(userId);
  return res.json({ success: true, orders });
});

// ADMIN ROUTES: Medicine Orders
router.get('/admin/all', (req: Request, res: Response) => {
  const allOrders = db.getOrders();
  return res.json({ success: true, orders: allOrders });
});

router.put('/admin/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateOrder(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json({ success: true, order: updated });
});

router.delete('/admin/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteOrder(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json({ success: true, message: 'Medicine order record deleted from database' });
});

export default router;
