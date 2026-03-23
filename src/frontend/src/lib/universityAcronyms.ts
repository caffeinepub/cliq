const ACRONYM_MAP: Record<string, string> = {
  "University of Lagos": "UNILAG",
  "University of Nigeria, Nsukka": "UNN",
  "University of Nigeria Nsukka": "UNN",
  "Obafemi Awolowo University": "OAU",
  "Ahmadu Bello University": "ABU",
  "University of Ibadan": "UI",
  "Bayero University Kano": "BUK",
  "University of Benin": "UNIBEN",
  "Lagos State University": "LASU",
  "Federal University of Technology Akure": "FUTA",
  "Nnamdi Azikiwe University": "UNIZIK",
  "University of Port Harcourt": "UNIPORT",
  "University of Calabar": "UNICAL",
  "University of Uyo": "UNIUYO",
  "University of Ilorin": "UNILORIN",
  "University of Jos": "UNIJOS",
  "University of Maiduguri": "UNIMAID",
  "University of Abuja": "UNIABUJA",
  "Federal University of Technology Minna": "FUTMINNA",
  "Federal University of Technology Owerri": "FUTO",
  "Covenant University": "CU",
  "Babcock University": "BU",
  "Redeemer's University": "RUN",
  "Pan-Atlantic University": "PAU",
  "American University of Nigeria": "AUN",
  "Benson Idahosa University": "BIU",
  "Bowen University": "BOWEN",
  "Crawford University": "CRAWFORD",
  "Abubakar Tafawa Balewa University": "ATBU",
  "Federal University Oye-Ekiti": "FUOYE",
  "Lagos State University of Science and Technology": "LASUSTECH",
  "Enugu State University of Science and Technology": "ESUT",
  "Rivers State University": "RSU",
  "Delta State University": "DELSU",
  "Imo State University": "IMSU",
  "Anambra State University": "ANSU",
  "Ekiti State University": "EKSU",
  "Osun State University": "UNIOSUN",
  "Kwara State University": "KWASU",
  "Kano State University of Technology": "KUST",
  "Kogi State University": "KSU",
  "Nasarawa State University": "NSUK",
  "Niger Delta University": "NDU",
  "Cross River University of Technology": "CRUTECH",
  "Michael Okpara University of Agriculture": "MOUAU",
  "Federal University of Agriculture Abeokuta": "FUNAAB",
  "Ambrose Alli University": "AAU",
  "Adekunle Ajasin University": "AAUA",
  "Olabisi Onabanjo University": "OOU",
};

export function getUniversityAcronym(fullName: string): string {
  if (ACRONYM_MAP[fullName]) return ACRONYM_MAP[fullName];
  // Try to generate acronym from first letters of words
  const words = fullName
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(of|and|the|in|at|for)$/i.test(w));
  if (words.length > 0) {
    return words.map((w) => w[0].toUpperCase()).join("");
  }
  return fullName.split(" ").slice(0, 2).join(" ");
}
