// Fabric knowledge — written for an ironing / garment-care business.
// Each entry: a short making-history + the correct pressing & care technique.
// Images live in /public/img and are free-license (Unsplash / Wikimedia Commons).

export const FABRICS = [
  {
    key: 'silk',
    name: 'Silk',
    tag: 'Delicate · low heat',
    image: '/img/silk.jpg',
    ironTemp: '110–120°C (silk setting) · no steam',
    history:
      'Woven from the filament of the mulberry silkworm, silk travelled the ancient Silk Road from China more than 4,000 years ago and became the world’s most prized luxury fibre. A single cocoon yields nearly a kilometre of continuous thread.',
    technique:
      'Always iron silk inside-out while slightly damp, on the lowest (silk) setting, using a dry pressing cloth between the iron and the fabric. Never spray water directly — droplets leave permanent rings. Keep the iron moving; never let it rest.',
    dos: ['Press inside-out', 'Use a cotton pressing cloth', 'Store on padded hangers'],
    donts: ['No direct steam or water spray', 'Never wring or twist'],
  },
  {
    key: 'banarasi',
    name: 'Banarasi Silk',
    tag: 'Premium · zari work',
    image: '/img/banarasi.jpg',
    ironTemp: '110°C · press cloth over zari',
    history:
      'The Banarasi sari, woven in Varanasi since the Mughal era, is famed for its gold and silver brocade (zari), fine silk, and intricate mughal-inspired motifs. A single ornate sari can take 15 days to a month on the handloom.',
    technique:
      'The real risk is the metallic zari, which tarnishes and dents under heat. Press only on the reverse, at low heat, with a soft cotton cloth over the zari. Fold along different lines each time it is stored to prevent permanent crease-lines cracking the brocade.',
    dos: ['Iron only on the reverse', 'Refold along new lines', 'Wrap in muslin for storage'],
    donts: ['Never iron directly over zari', 'No hanging (weight distorts weave)'],
  },
  {
    key: 'cotton',
    name: 'Cotton',
    tag: 'Everyday · high heat',
    image: '/img/cotton.jpg',
    ironTemp: '180–200°C · steam friendly',
    history:
      'Spun and woven in the Indian subcontinent for over 6,000 years, cotton comes from the soft boll of the cotton plant. Fine Indian muslins were once so light they were called “woven air”.',
    technique:
      'Cotton loves heat and moisture. Iron while slightly damp on a high setting with steam for crisp results. Press collars, cuffs and plackets first, from the inside out, then the larger panels. Hang immediately to keep the finish sharp.',
    dos: ['Iron slightly damp', 'Use steam freely', 'Press seams & collars first'],
    donts: ['Avoid over-drying before pressing', 'Don’t scorch — keep moving'],
  },
  {
    key: 'linen',
    name: 'Linen',
    tag: 'Breathable · high heat',
    image: '/img/linen.jpg',
    ironTemp: '190–210°C · plenty of steam',
    history:
      'Made from the fibres of the flax plant, linen is one of the oldest textiles known — used for burial shrouds in ancient Egypt. It is prized for keeping the wearer cool, but it creases the moment you look at it.',
    technique:
      'Iron linen thoroughly damp on the highest setting with generous steam; dry linen simply will not release its creases. Work on the reverse for dark colours to avoid a shine, and press garments while still slightly wet from the wash.',
    dos: ['Iron damp with high steam', 'Press dark linen inside-out', 'Finish on flat, not hung'],
    donts: ['Never iron bone-dry linen', 'Avoid harsh folds when storing'],
  },
  {
    key: 'wool',
    name: 'Wool',
    tag: 'Suiting · steam only',
    image: '/img/wool.jpg',
    ironTemp: '148°C (wool) · steam, no pressure',
    history:
      'Sheared from sheep and refined over centuries into fine worsted suiting, wool is naturally elastic and wrinkle-resistant. The best men’s suits use tightly-spun worsted wool that holds its shape through the day.',
    technique:
      'Wool must never meet a hot iron directly — it scorches and goes shiny. Press through a damp cotton cloth, using the iron’s weight and steam to “set” the wool rather than dragging it. Let the garment cool flat before wearing so the shape locks in.',
    dos: ['Always use a damp press cloth', 'Steam to relax, then cool flat', 'Rest suits 24h between wears'],
    donts: ['No direct iron contact', 'Never press a shine into lapels'],
  },
  {
    key: 'georgette',
    name: 'Georgette & Chiffon',
    tag: 'Sheer · very low heat',
    image: '/img/georgette.jpg',
    ironTemp: '110°C or below · no steam',
    history:
      'Named after early-1900s French dressmaker Georgette de la Plante, georgette and chiffon are sheer, crinkly fabrics woven from tightly twisted yarns. Their floaty drape makes them a favourite for elegant sarees and dupattas.',
    technique:
      'These sheer fabrics pucker and melt with heat. Iron on the lowest setting, no steam, with a pressing cloth, moving quickly. Better still, hang them in a steamy bathroom to let the creases fall out, or use a handheld steamer held away from the fabric.',
    dos: ['Lowest heat with a press cloth', 'Prefer hanging-steam over ironing', 'Keep the iron moving'],
    donts: ['No steam directly on fabric', 'Never leave the iron resting'],
  },
]
