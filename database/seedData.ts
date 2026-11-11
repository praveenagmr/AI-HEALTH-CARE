/**
 * AI HEALTH CARE - Seed Data: Medicines, Sample Medical Reports & Preset Issue Photos
 */
import { MedicineItem } from './schema.ts';

export const SEED_MEDICINES: MedicineItem[] = [
  // Skin
  {
    id: 'med-skin-01',
    name: 'Hydrocortisone Calming Cream (1%)',
    genericName: 'Hydrocortisone Topical USP',
    category: 'skin',
    indication: 'Relief for inflammatory skin rash, dermatitis, eczema, and itching',
    dosage: 'Apply a thin layer 2 times daily',
    timing: 'Morning and Night after gentle washing',
    priceInr: 145,
    requiresPrescription: false,
    stockStatus: 'in_stock',
    precautions: 'Do not use on open wounds or infected skin without doctor guidance.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'med-skin-02',
    name: 'Cetirizine Antihistamine 10mg',
    genericName: 'Cetirizine Hydrochloride',
    category: 'skin',
    indication: 'Anti-allergy for hives, skin itching, and allergic rhinitis',
    dosage: '1 tablet once daily',
    timing: 'Night before sleep with water',
    priceInr: 65,
    requiresPrescription: false,
    stockStatus: 'in_stock',
    precautions: 'May cause mild drowsiness. Avoid alcohol.',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'med-skin-03',
    name: 'Clindamycin Anti-Acne Gel (1%)',
    genericName: 'Clindamycin Phosphate',
    category: 'skin',
    indication: 'Bacterial acne vulgaris and inflammatory pustules',
    dosage: 'Apply pea-sized amount directly on lesions',
    timing: 'Bedtime on cleansed, dry skin',
    priceInr: 180,
    requiresPrescription: true,
    stockStatus: 'in_stock',
    precautions: 'Avoid contact with eyes, mouth, and broken skin.',
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&auto=format&fit=crop&q=60',
  },

  // Hair
  {
    id: 'med-hair-01',
    name: 'Ketoconazole Anti-Dandruff Solution 2%',
    genericName: 'Ketoconazole Scalp Solution',
    category: 'hair',
    indication: 'Stubborn dandruff, seborrheic dermatitis, itchy scalp fungal infections',
    dosage: 'Lather onto scalp and leave for 3 to 5 minutes before rinsing',
    timing: 'Use 2 to 3 times a week',
    priceInr: 230,
    requiresPrescription: false,
    stockStatus: 'in_stock',
    precautions: 'Keep away from eyes. Discontinue if severe burning sensation occurs.',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'med-hair-02',
    name: 'Biotin + Zinc Follicle Vitalizer Tabs',
    genericName: 'Biotin 10,000 mcg with Zinc & Amino Acids',
    category: 'hair',
    indication: 'Hair thinning, brittle hair strands, and nutritional hair fall support',
    dosage: '1 tablet daily after food',
    timing: 'Post lunch with fresh water',
    priceInr: 320,
    requiresPrescription: false,
    stockStatus: 'in_stock',
    precautions: 'Nutritional supplement. Maintain balanced hydration.',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=60',
  },

  // Dental
  {
    id: 'med-dental-01',
    name: 'Chlorhexidine Antiseptic Mouth Rinse 0.2%',
    genericName: 'Chlorhexidine Gluconate',
    category: 'dental',
    indication: 'Gingivitis, bleeding swollen gums, oral bacterial control',
    dosage: 'Swish 10ml undiluted for 60 seconds and spit out',
    timing: 'Twice daily after brushing',
    priceInr: 110,
    requiresPrescription: false,
    stockStatus: 'in_stock',
    precautions: 'Do not swallow. Avoid eating or drinking for 30 minutes after use.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'med-dental-02',
    name: 'Potassium Nitrate Desensitizing Dental Gel',
    genericName: 'Potassium Nitrate & Sodium Fluoride Paste',
    category: 'dental',
    indication: 'Tooth sensitivity to hot/cold, enamel erosion, dental discomfort',
    dosage: 'Brush gently with soft bristle brush or apply fingertip directly',
    timing: 'Twice daily',
    priceInr: 160,
    requiresPrescription: false,
    stockStatus: 'in_stock',
    precautions: 'If pain persists over 2 weeks, consult a dentist for root canal check.',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&auto=format&fit=crop&q=60',
  },

  // Eye
  {
    id: 'med-eye-01',
    name: 'Carboxymethylcellulose Eye Drops 0.5%',
    genericName: 'Carboxymethylcellulose Sodium Lubricant',
    category: 'eye',
    indication: 'Digital eye strain, dry eyes, burning sensation, irritation',
    dosage: '1 to 2 drops in the affected eye(s)',
    timing: '3 to 4 times daily as needed',
    priceInr: 175,
    requiresPrescription: false,
    stockStatus: 'in_stock',
    precautions: 'Do not touch dropper tip to eye or skin surface to prevent contamination.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'med-eye-02',
    name: 'Olopatadine Anti-Allergic Eye Drops 0.1%',
    genericName: 'Olopatadine Hydrochloride',
    category: 'eye',
    indication: 'Allergic conjunctivitis, itchy red watery eyes from dust or pollen',
    dosage: '1 drop in each eye',
    timing: 'Twice daily at 8-hour intervals',
    priceInr: 210,
    requiresPrescription: true,
    stockStatus: 'in_stock',
    precautions: 'Remove contact lenses before instilling. Wait 15 mins before reinserting.',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=60',
  },

  // Other / General
  {
    id: 'med-other-01',
    name: 'Paracetamol 650mg Relief Tablets',
    genericName: 'Paracetamol (Acetaminophen)',
    category: 'other',
    indication: 'Mild to moderate fever, headache, body ache, sore throat pain',
    dosage: '1 tablet after food',
    timing: 'Every 6-8 hours as required (max 3/day)',
    priceInr: 35,
    requiresPrescription: false,
    stockStatus: 'in_stock',
    precautions: 'Do not exceed 3000mg/day. Keep out of reach of children.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'med-other-02',
    name: 'Oral Rehydration Salts (WHO Formula)',
    genericName: 'Sodium Chloride, Potassium Chloride, Dextrose',
    category: 'other',
    indication: 'Dehydration, weakness, recovery from diarrhea or heat fatigue',
    dosage: 'Dissolve 1 sachet in 1 liter clean drinking water',
    timing: 'Sip steadily over 24 hours',
    priceInr: 25,
    requiresPrescription: false,
    stockStatus: 'in_stock',
    precautions: 'Discard unused solution after 24 hours.',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=60',
  },
];

// Sample Medical Reports for Instant User Testing
export const SAMPLE_REPORTS = [
  {
    id: 'rep-sample-01',
    title: 'Complete Blood & Allergy Profile (CBC + IgE)',
    fileName: 'Patient_Lab_Report_CBC_IgE.pdf',
    type: 'PDF Document',
    category: 'skin',
    content: `PATIENT DIAGNOSTIC REPORT
Name: Ramesh Kumar | Age: 34 | Sex: Male
Referred by: AI Health Care Clinic
Test: Serum IgE & Complete Blood Count
Results:
- Total Serum IgE: 480 IU/mL (Normal Reference: < 100 IU/mL) -> ELEVATED (Indicates Allergic Predisposition / Atopy)
- Absolute Eosinophil Count: 620 cells/mcL (Normal: 50-500) -> MILD EOSINOPHILIA
- Hemoglobin: 14.2 g/dL (Normal)
- Platelet Count: 240,000 /mcL (Normal)
Clinical Interpretation:
Findings indicate acute allergic hypersensitivity dermatitis or urticaria reaction. Recommended antihistamine regimen and topical skin barrier repair.`,
  },
  {
    id: 'rep-sample-02',
    title: 'Dermatology Scalp & Hair Follicle Biopsy',
    fileName: 'Trichology_Scalp_Evaluation.pdf',
    type: 'PDF Document',
    category: 'hair',
    content: `TRICHOLOGY & DERMATOLOGY EVALUATION
Patient: Sunita Patel | Age: 29 | Sex: Female
Examination: Scalp Dermoscopy (Trichoscopy)
Findings:
- Erythema with greasy yellowish follicular scales along vertex and crown.
- Fungal hyphae consistent with Malassezia globosa colonization.
- No cicatricial scarring alopecia noted; telogen effluvium observed at ~22%.
Diagnosis: Seborrheic Dermatitis of Scalp with Secondary Telogen Effluvium.
Recommendation: Ketoconazole 2% scalp treatment and nutritional biotin supplementation.`,
  },
  {
    id: 'rep-sample-03',
    title: 'Dental Panoramic X-Ray & Gingival Index',
    fileName: 'Dental_Panoramic_OPG_Report.docx',
    type: 'DOCX Document',
    category: 'dental',
    content: `ORAL HEALTH & RADIOGRAPHIC REPORT
Patient: Mohammed Arif | Age: 41 | Sex: Male
Clinical Findings:
- Marginal gingival erythema, bleeding on probing (BOP) at quadrant 3 & 4.
- Periodontal pocket depths: 3-4mm localized around lower molars.
- Enamel erosion on cervical thirds with reported temperature sensitivity.
Impression: Localized Mild-to-Moderate Gingivitis and Dentin Hypersensitivity.
Care Plan: Chlorhexidine antiseptic rinse for 14 days, desensitizing potassium nitrate paste, professional ultrasonic prophylaxis.`,
  },
  {
    id: 'rep-sample-04',
    title: 'Ophthalmology Slit-Lamp & Tear Breakup Report',
    fileName: 'Eye_SlitLamp_Tear_Breakup_Exam.pdf',
    type: 'PDF Document',
    category: 'eye',
    content: `OPHTHALMOLOGY CLINICAL SUMMARY
Patient: David Johnson | Age: 36 | Sex: Male
Test: Slit Lamp Biomicroscopy & Tear Film Break-Up Time (TBUT)
Findings:
- Bilateral conjunctival hyperemia, mild palpebral papillary reaction.
- TBUT: 5 seconds (Normal > 10 seconds) indicating evaporative dry eye disease.
- Cornea clear, no corneal ulceration or foreign body.
Diagnosis: Digital Eye Strain & Mild Allergic Conjunctivitis.
Prescription: Preservative-free lubricating eye drops (Carboxymethylcellulose) + Olopatadine drops twice daily.`,
  },
];

// Sample Clinical Issue Photos (inline SVG data-uris representing clinical conditions for instant testing)
export const SAMPLE_PHOTOS = [
  {
    id: 'photo-skin-rash',
    title: 'Skin Allergic Rash / Eczema Patch',
    category: 'skin',
    description: 'Redness, circular erythematous plaques with mild papules on forearm',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f7e6d8"/><circle cx="200" cy="150" r="85" fill="%23e87878" opacity="0.65"/><circle cx="180" cy="140" r="45" fill="%23d64545" opacity="0.7"/><circle cx="225" cy="165" r="35" fill="%23e05656" opacity="0.75"/><circle cx="160" cy="170" r="12" fill="%23b82e2e"/><circle cx="210" cy="120" r="10" fill="%23b82e2e"/><circle cx="240" cy="150" r="15" fill="%23b82e2e"/><circle cx="190" cy="180" r="9" fill="%23b82e2e"/><text x="200" y="270" font-family="sans-serif" font-size="14" font-weight="bold" fill="%237a3b3b" text-anchor="middle">Clinical Skin Issue: Erythematous Dermatitis</text></svg>',
  },
  {
    id: 'photo-hair-dandruff',
    title: 'Scalp Flaking & Follicle Redness',
    category: 'hair',
    description: 'Yellow-white flakes, scalp dryness, and localized inflammation',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f1e3d3"/><path d="M 50 150 Q 200 60 350 150 Q 200 240 50 150" fill="%23e0cca9"/><path d="M 80 140 Q 200 80 320 140" stroke="%233a2512" stroke-width="4" fill="none"/><path d="M 70 160 Q 200 100 330 160" stroke="%232b1a0d" stroke-width="3" fill="none"/><path d="M 90 120 Q 200 60 310 120" stroke="%234a331c" stroke-width="3" fill="none"/><circle cx="160" cy="130" r="8" fill="%23fffbee"/><circle cx="230" cy="140" r="10" fill="%23fffbee"/><circle cx="195" cy="110" r="7" fill="%23fffbee"/><circle cx="250" cy="120" r="9" fill="%23fffbee"/><circle cx="140" cy="150" r="6" fill="%23fca5a5"/><text x="200" y="270" font-family="sans-serif" font-size="14" font-weight="bold" fill="%2357381b" text-anchor="middle">Scalp Examination: Seborrheic Scaling</text></svg>',
  },
  {
    id: 'photo-dental-gingivitis',
    title: 'Dental & Gum Inflammation',
    category: 'dental',
    description: 'Swollen erythematous gingiva around lower anterior teeth',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%232e0c15"/><path d="M 60 80 Q 200 130 340 80 L 340 130 Q 200 170 60 130 Z" fill="%23d64558"/><path d="M 60 220 Q 200 170 340 220 L 340 170 Q 200 130 60 170 Z" fill="%23e84a5f"/><rect x="130" y="115" width="30" height="40" rx="6" fill="%23fdfbf7"/><rect x="165" y="110" width="32" height="46" rx="6" fill="%23fefdfa"/><rect x="202" y="110" width="32" height="46" rx="6" fill="%23fefdfa"/><rect x="239" y="115" width="30" height="40" rx="6" fill="%23fdfbf7"/><circle cx="165" cy="155" r="8" fill="%23b91c1c"/><circle cx="202" cy="155" r="9" fill="%23b91c1c"/><text x="200" y="275" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23ff9494" text-anchor="middle">Oral Photo: Marginal Gingivitis & Erythema</text></svg>',
  },
  {
    id: 'photo-eye-conjunctivitis',
    title: 'Eye Redness / Conjunctival Congestion',
    category: 'eye',
    description: 'Ciliary injection, vascular engorgement, and watery redness',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23eddcd2"/><path d="M 60 150 Q 200 60 340 150 Q 200 240 60 150 Z" fill="%23ffffff" stroke="%236b7280" stroke-width="2"/><circle cx="200" cy="150" r="50" fill="%23475569"/><circle cx="200" cy="150" r="24" fill="%230f172a"/><circle cx="210" cy="140" r="7" fill="%23ffffff"/><path d="M 80 150 Q 120 145 150 148" stroke="%23ef4444" stroke-width="2.5" fill="none"/><path d="M 90 135 Q 130 140 145 142" stroke="%23ef4444" stroke-width="2" fill="none"/><path d="M 85 165 Q 125 155 148 153" stroke="%23ef4444" stroke-width="2" fill="none"/><path d="M 250 148 Q 280 145 320 150" stroke="%23ef4444" stroke-width="2.5" fill="none"/><path d="M 255 142 Q 285 140 315 135" stroke="%23ef4444" stroke-width="2" fill="none"/><text x="200" y="275" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23991b1b" text-anchor="middle">Eye Examination: Conjunctival Hyperemia</text></svg>',
  },
];
