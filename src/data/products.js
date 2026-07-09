const products = [
  {
    id: 'sculpted-wool-coat',
    name: 'Sculpted Wool Coat',
    category: 'Outerwear',
    price: 420,
    description:
      'A sharply structured wool coat with a clean shoulder line, concealed fastening, and a long sculptural profile.',
    sizes: ['XS', 'S', 'M', 'L'],
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=85',
    ],
  },
  {
    id: 'column-evening-dress',
    name: 'Column Evening Dress',
    category: 'Dresses',
    price: 360,
    description:
      'A refined evening column dress with a precise neckline, fluid fall, and minimal finishing.',
    sizes: ['XS', 'S', 'M', 'L'],
    image:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1100&q=85',
    ],
  },
  {
    id: 'leather-mini-bag',
    name: 'Leather Mini Bag',
    category: 'Accessories',
    price: 185,
    description:
      'A compact leather bag with a polished shape, clean hardware, and versatile day-to-evening scale.',
    sizes: ['One Size'],
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1100&q=85',
    ],
  },
  {
    id: 'silk-drape-shirt',
    name: 'Silk Drape Shirt',
    category: 'Shirting',
    price: 145,
    description:
      'A fluid silk shirt designed with a relaxed drape, elongated cuffs, and a softly luminous finish.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=1100&q=85',
    ],
  },
  {
    id: 'tailored-pleat-trouser',
    name: 'Tailored Pleat Trouser',
    category: 'Tailoring',
    price: 210,
    description:
      'A pleated trouser with a clean waistband, elongated leg, and crisp tailored movement.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1100&q=85',
    ],
  },
  {
    id: 'satin-evening-skirt',
    name: 'Satin Evening Skirt',
    category: 'Dresses',
    price: 230,
    description:
      'A satin skirt cut with a narrow waist and liquid movement for understated evening dressing.',
    sizes: ['XS', 'S', 'M', 'L'],
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1100&q=85',
    ],
  },
  {
    id: 'structured-blazer',
    name: 'Structured Blazer',
    category: 'Tailoring',
    price: 390,
    description:
      'A precise blazer with defined shoulders, a nipped waist, and a polished single-breasted close.',
    sizes: ['XS', 'S', 'M', 'L'],
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?auto=format&fit=crop&w=1100&q=85',
    ],
  },
  {
    id: 'soft-cashmere-knit',
    name: 'Soft Cashmere Knit',
    category: 'Knitwear',
    price: 175,
    description:
      'A soft cashmere knit with a clean neckline, refined weight, and easy layered proportion.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=85',
    ],
  },
  {
    id: 'patent-slingback-heel',
    name: 'Patent Slingback Heel',
    category: 'Shoes',
    price: 245,
    description:
      'A patent slingback heel with a pointed toe, slim strap, and polished evening profile.',
    sizes: ['36', '37', '38', '39', '40', '41'],
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1100&q=85',
    ],
  },
  {
    id: 'minimal-leather-belt',
    name: 'Minimal Leather Belt',
    category: 'Accessories',
    price: 95,
    description:
      'A minimal leather belt finished with a slim buckle and smooth edge work.',
    sizes: ['S', 'M', 'L'],
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=85',
    ],
  },
  {
    id: 'longline-poplin-shirt',
    name: 'Longline Poplin Shirt',
    category: 'Shirting',
    price: 125,
    description:
      'A longline poplin shirt with a crisp hand feel, extended hem, and exact collar shape.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1100&q=85',
    ],
  },
  {
    id: 'cropped-evening-jacket',
    name: 'Cropped Evening Jacket',
    category: 'Outerwear',
    price: 315,
    description:
      'A cropped jacket with evening polish, compact structure, and a clean architectural finish.',
    sizes: ['XS', 'S', 'M', 'L'],
    image:
      'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?auto=format&fit=crop&w=900&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?auto=format&fit=crop&w=1100&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=85',
    ],
  },
];

export default products;
