export const UNIVERSITIES = [
  'University of Lagos',
  'University of Ibadan',
  'Obafemi Awolowo University',
  'University of Nigeria, Nsukka',
  'Ahmadu Bello University',
  'University of Benin',
  'Lagos State University',
  'Covenant University',
  'Babcock University',
  'Federal University of Technology, Akure',
  'University of Port Harcourt',
  'Nnamdi Azikiwe University',
  'University of Ilorin',
  'Federal University of Technology, Minna',
  'University of Jos',
  'Bayero University Kano',
  'University of Calabar',
  'Rivers State University',
  'Ekiti State University',
  'Delta State University',
] as const;

export type University = typeof UNIVERSITIES[number];
