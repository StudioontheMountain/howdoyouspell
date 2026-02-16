import { NextResponse } from "next/server"

// Comprehensive English word list (~10,000 most common words)
// This covers 98%+ of words people actually search for
const WORD_LIST_URL = "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears.txt"

let DICTIONARY: Set<string> | null = null

async function loadDictionary(): Promise<Set<string>> {
  if (DICTIONARY) return DICTIONARY

  try {
    const res = await fetch(WORD_LIST_URL)
    const text = await res.text()
    DICTIONARY = new Set(text.split("\n").map(w => w.trim().toLowerCase()).filter(Boolean))
    
    // Add additional words that may not be in the 10K list
    const extras = [
      "alphabet", "accommodate", "acquaintance", "acquisition", "bureaucracy",
      "calendar", "camouflage", "conscientious", "conscience", "definitely",
      "embarrass", "encyclopedia", "entrepreneur", "fluorescent", "guarantee",
      "handkerchief", "hemorrhage", "hierarchical", "hygiene", "idiosyncrasy",
      "independent", "inoculate", "jewelry", "jewellery", "knowledge",
      "liaison", "lieutenant", "maintenance", "maneuver", "manoeuvre",
      "medieval", "millennium", "miniature", "miscellaneous", "misspell",
      "necessary", "occurrence", "ophthalmologist", "parliament", "perseverance",
      "pharmaceutical", "pneumonia", "privilege", "pronunciation", "psychiatrist",
      "questionnaire", "receipt", "recommend", "reconnaissance", "restaurant",
      "rhyme", "rhythm", "schedule", "scissors", "separate", "sergeant",
      "silhouette", "subpoena", "superintendent", "supersede", "surveillance",
      "their", "thorough", "threshold", "tomorrow", "tyranny",
      "ubiquitous", "unanimous", "vacuum", "vehicle", "vengeance", "weird",
      // Dialect words
      "colour", "favour", "honour", "humour", "labour", "neighbour", "behaviour",
      "flavour", "saviour", "rumour", "vigour", "organise", "realise", "recognise",
      "apologise", "minimise", "customise", "prioritise", "summarise",
      "centre", "theatre", "metre", "litre", "fibre", "defence", "offence",
      "licence", "practise", "catalogue", "dialogue", "analogue",
      "travelled", "cancelled", "modelling", "counsellor",
      "aeroplane", "aluminium", "grey", "cheque", "tyre", "pyjamas",
      "doughnut", "fulfil", "enrolment", "ageing", "judgement",
      "sceptic", "kerb", "manoeuvre",
    ]
    
    for (const word of extras) {
      DICTIONARY.add(word.toLowerCase())
    }
    
    return DICTIONARY
  } catch {
    // Fallback - return a minimal set
    DICTIONARY = new Set(["the", "and", "for", "are", "but", "not", "you", "all"])
    return DICTIONARY
  }
}

// Levenshtein distance
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

// Dialect differences
const DIALECT_DIFFERENCES: Record<string, { us: string; uk: string; au: string; nz: string }> = {
  "color": { us: "color", uk: "colour", au: "colour", nz: "colour" },
  "colour": { us: "color", uk: "colour", au: "colour", nz: "colour" },
  "favor": { us: "favor", uk: "favour", au: "favour", nz: "favour" },
  "favour": { us: "favor", uk: "favour", au: "favour", nz: "favour" },
  "honor": { us: "honor", uk: "honour", au: "honour", nz: "honour" },
  "honour": { us: "honor", uk: "honour", au: "honour", nz: "honour" },
  "humor": { us: "humor", uk: "humour", au: "humour", nz: "humour" },
  "humour": { us: "humor", uk: "humour", au: "humour", nz: "humour" },
  "labor": { us: "labor", uk: "labour", au: "labour", nz: "labour" },
  "labour": { us: "labor", uk: "labour", au: "labour", nz: "labour" },
  "neighbor": { us: "neighbor", uk: "neighbour", au: "neighbour", nz: "neighbour" },
  "neighbour": { us: "neighbor", uk: "neighbour", au: "neighbour", nz: "neighbour" },
  "behavior": { us: "behavior", uk: "behaviour", au: "behaviour", nz: "behaviour" },
  "behaviour": { us: "behavior", uk: "behaviour", au: "behaviour", nz: "behaviour" },
  "flavor": { us: "flavor", uk: "flavour", au: "flavour", nz: "flavour" },
  "flavour": { us: "flavor", uk: "flavour", au: "flavour", nz: "flavour" },
  "savior": { us: "savior", uk: "saviour", au: "saviour", nz: "saviour" },
  "saviour": { us: "savior", uk: "saviour", au: "saviour", nz: "saviour" },
  "rumor": { us: "rumor", uk: "rumour", au: "rumour", nz: "rumour" },
  "rumour": { us: "rumor", uk: "rumour", au: "rumour", nz: "rumour" },
  "vigor": { us: "vigor", uk: "vigour", au: "vigour", nz: "vigour" },
  "vigour": { us: "vigor", uk: "vigour", au: "vigour", nz: "vigour" },
  "organize": { us: "organize", uk: "organise", au: "organise", nz: "organise" },
  "organise": { us: "organize", uk: "organise", au: "organise", nz: "organise" },
  "realize": { us: "realize", uk: "realise", au: "realise", nz: "realise" },
  "realise": { us: "realize", uk: "realise", au: "realise", nz: "realise" },
  "recognize": { us: "recognize", uk: "recognise", au: "recognise", nz: "recognise" },
  "recognise": { us: "recognize", uk: "recognise", au: "recognise", nz: "recognise" },
  "apologize": { us: "apologize", uk: "apologise", au: "apologise", nz: "apologise" },
  "apologise": { us: "apologize", uk: "apologise", au: "apologise", nz: "apologise" },
  "minimize": { us: "minimize", uk: "minimise", au: "minimise", nz: "minimise" },
  "minimise": { us: "minimize", uk: "minimise", au: "minimise", nz: "minimise" },
  "customize": { us: "customize", uk: "customise", au: "customise", nz: "customise" },
  "customise": { us: "customize", uk: "customise", au: "customise", nz: "customise" },
  "prioritize": { us: "prioritize", uk: "prioritise", au: "prioritise", nz: "prioritise" },
  "prioritise": { us: "prioritize", uk: "prioritise", au: "prioritise", nz: "prioritise" },
  "summarize": { us: "summarize", uk: "summarise", au: "summarise", nz: "summarise" },
  "summarise": { us: "summarize", uk: "summarise", au: "summarise", nz: "summarise" },
  "center": { us: "center", uk: "centre", au: "centre", nz: "centre" },
  "centre": { us: "center", uk: "centre", au: "centre", nz: "centre" },
  "theater": { us: "theater", uk: "theatre", au: "theatre", nz: "theatre" },
  "theatre": { us: "theater", uk: "theatre", au: "theatre", nz: "theatre" },
  "meter": { us: "meter", uk: "metre", au: "metre", nz: "metre" },
  "metre": { us: "meter", uk: "metre", au: "metre", nz: "metre" },
  "liter": { us: "liter", uk: "litre", au: "litre", nz: "litre" },
  "litre": { us: "liter", uk: "litre", au: "litre", nz: "litre" },
  "fiber": { us: "fiber", uk: "fibre", au: "fibre", nz: "fibre" },
  "fibre": { us: "fiber", uk: "fibre", au: "fibre", nz: "fibre" },
  "defense": { us: "defense", uk: "defence", au: "defence", nz: "defence" },
  "defence": { us: "defense", uk: "defence", au: "defence", nz: "defence" },
  "offense": { us: "offense", uk: "offence", au: "offence", nz: "offence" },
  "offence": { us: "offense", uk: "offence", au: "offence", nz: "offence" },
  "license": { us: "license", uk: "licence", au: "licence", nz: "licence" },
  "licence": { us: "license", uk: "licence", au: "licence", nz: "licence" },
  "practice": { us: "practice", uk: "practise", au: "practise", nz: "practise" },
  "practise": { us: "practice", uk: "practise", au: "practise", nz: "practise" },
  "catalog": { us: "catalog", uk: "catalogue", au: "catalogue", nz: "catalogue" },
  "catalogue": { us: "catalog", uk: "catalogue", au: "catalogue", nz: "catalogue" },
  "dialog": { us: "dialog", uk: "dialogue", au: "dialogue", nz: "dialogue" },
  "dialogue": { us: "dialog", uk: "dialogue", au: "dialogue", nz: "dialogue" },
  "analog": { us: "analog", uk: "analogue", au: "analogue", nz: "analogue" },
  "analogue": { us: "analog", uk: "analogue", au: "analogue", nz: "analogue" },
  "traveled": { us: "traveled", uk: "travelled", au: "travelled", nz: "travelled" },
  "travelled": { us: "traveled", uk: "travelled", au: "travelled", nz: "travelled" },
  "canceled": { us: "canceled", uk: "cancelled", au: "cancelled", nz: "cancelled" },
  "cancelled": { us: "canceled", uk: "cancelled", au: "cancelled", nz: "cancelled" },
  "modeling": { us: "modeling", uk: "modelling", au: "modelling", nz: "modelling" },
  "modelling": { us: "modeling", uk: "modelling", au: "modelling", nz: "modelling" },
  "counselor": { us: "counselor", uk: "counsellor", au: "counsellor", nz: "counsellor" },
  "counsellor": { us: "counselor", uk: "counsellor", au: "counsellor", nz: "counsellor" },
  "airplane": { us: "airplane", uk: "aeroplane", au: "aeroplane", nz: "aeroplane" },
  "aeroplane": { us: "airplane", uk: "aeroplane", au: "aeroplane", nz: "aeroplane" },
  "aluminum": { us: "aluminum", uk: "aluminium", au: "aluminium", nz: "aluminium" },
  "aluminium": { us: "aluminum", uk: "aluminium", au: "aluminium", nz: "aluminium" },
  "gray": { us: "gray", uk: "grey", au: "grey", nz: "grey" },
  "grey": { us: "gray", uk: "grey", au: "grey", nz: "grey" },
  "check": { us: "check", uk: "cheque", au: "cheque", nz: "cheque" },
  "cheque": { us: "check", uk: "cheque", au: "cheque", nz: "cheque" },
  "tire": { us: "tire", uk: "tyre", au: "tyre", nz: "tyre" },
  "tyre": { us: "tire", uk: "tyre", au: "tyre", nz: "tyre" },
  "pajamas": { us: "pajamas", uk: "pyjamas", au: "pyjamas", nz: "pyjamas" },
  "pyjamas": { us: "pajamas", uk: "pyjamas", au: "pyjamas", nz: "pyjamas" },
  "donut": { us: "donut", uk: "doughnut", au: "doughnut", nz: "doughnut" },
  "doughnut": { us: "donut", uk: "doughnut", au: "doughnut", nz: "doughnut" },
  "jewelry": { us: "jewelry", uk: "jewellery", au: "jewellery", nz: "jewellery" },
  "jewellery": { us: "jewelry", uk: "jewellery", au: "jewellery", nz: "jewellery" },
  "fulfill": { us: "fulfill", uk: "fulfil", au: "fulfil", nz: "fulfil" },
  "fulfil": { us: "fulfill", uk: "fulfil", au: "fulfil", nz: "fulfil" },
  "enrollment": { us: "enrollment", uk: "enrolment", au: "enrolment", nz: "enrolment" },
  "enrolment": { us: "enrollment", uk: "enrolment", au: "enrolment", nz: "enrolment" },
  "aging": { us: "aging", uk: "ageing", au: "ageing", nz: "ageing" },
  "ageing": { us: "aging", uk: "ageing", au: "ageing", nz: "ageing" },
  "judgment": { us: "judgment", uk: "judgement", au: "judgement", nz: "judgement" },
  "judgement": { us: "judgment", uk: "judgement", au: "judgement", nz: "judgement" },
  "skeptic": { us: "skeptic", uk: "sceptic", au: "sceptic", nz: "sceptic" },
  "sceptic": { us: "skeptic", uk: "sceptic", au: "sceptic", nz: "sceptic" },
  "curb": { us: "curb", uk: "kerb", au: "kerb", nz: "kerb" },
  "kerb": { us: "curb", uk: "kerb", au: "kerb", nz: "kerb" },
  "maneuver": { us: "maneuver", uk: "manoeuvre", au: "manoeuvre", nz: "manoeuvre" },
  "manoeuvre": { us: "maneuver", uk: "manoeuvre", au: "manoeuvre", nz: "manoeuvre" },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const word = searchParams.get("word")?.toLowerCase().trim()

  if (!word) {
    return NextResponse.json({ error: "No word provided" }, { status: 400 })
  }

  const dictionary = await loadDictionary()

  // Check if already correctly spelled
  if (dictionary.has(word)) {
    return NextResponse.json({
      word,
      confidence: "exact",
      dialects: DIALECT_DIFFERENCES[word] || null,
    })
  }

  // Check misspellings dictionary first (common known misspellings)
  const MISSPELLINGS: Record<string, string> = {
    "accomodate": "accommodate", "acommodate": "accommodate", "acomodate": "accommodate",
    "acheive": "achieve", "achive": "achieve",
    "acquaintence": "acquaintance", "aquaintance": "acquaintance",
    "agressive": "aggressive", "aggresive": "aggressive",
    "alot": "a lot",
    "aparent": "apparent", "apparant": "apparent",
    "arguement": "argument", "arguemant": "argument",
    "athiest": "atheist",
    "beautifull": "beautiful", "beautifal": "beautiful", "beutiful": "beautiful",
    "begining": "beginning", "begginning": "beginning",
    "beleive": "believe", "belive": "believe", "beleave": "believe",
    "bizzare": "bizarre", "bizare": "bizarre",
    "calender": "calendar", "calander": "calendar", "calandar": "calendar",
    "camoflage": "camouflage", "camoflague": "camouflage",
    "carribean": "Caribbean", "caribean": "Caribbean",
    "cemetary": "cemetery", "cematery": "cemetery",
    "changable": "changeable",
    "colectable": "collectible",
    "comming": "coming",
    "commited": "committed", "comitted": "committed",
    "concensus": "consensus", "concensous": "consensus",
    "concience": "conscience", "consience": "conscience",
    "concientious": "conscientious", "consciencious": "conscientious",
    "copywrite": "copyright",
    "curiousity": "curiosity",
    "definately": "definitely", "definatly": "definitely", "defiantly": "definitely", "definetly": "definitely", "definitly": "definitely",
    "desireable": "desirable",
    "develope": "develop",
    "diffrence": "difference", "diference": "difference",
    "dilema": "dilemma", "dilemna": "dilemma", "dillema": "dilemma",
    "disapoint": "disappoint", "dissapoint": "disappoint",
    "embarass": "embarrass", "embarras": "embarrass", "embaress": "embarrass", "embarrased": "embarrassed",
    "enviroment": "environment", "enviorment": "environment",
    "exagerate": "exaggerate", "exaggarate": "exaggerate",
    "excede": "exceed", "exeed": "exceed",
    "existance": "existence", "existense": "existence",
    "expierence": "experience", "experiance": "experience",
    "facinating": "fascinating",
    "firey": "fiery",
    "flourescent": "fluorescent",
    "foriegn": "foreign", "forein": "foreign",
    "fourty": "forty",
    "freind": "friend", "frend": "friend",
    "goverment": "government", "govermnent": "government", "govenment": "government",
    "grammer": "grammar", "gramer": "grammar",
    "gratefull": "grateful", "greatful": "grateful",
    "gaurantee": "guarantee", "guarentee": "guarantee", "garantee": "guarantee",
    "harrass": "harass", "harras": "harass",
    "heighth": "height",
    "heirarchy": "hierarchy", "heirachy": "hierarchy",
    "humourous": "humorous", "humerous": "humorous",
    "hygeine": "hygiene", "hygine": "hygiene",
    "ignorence": "ignorance",
    "immediatly": "immediately", "imediately": "immediately",
    "independant": "independent", "independend": "independent",
    "innoculate": "inoculate",
    "inteligence": "intelligence", "intellegence": "intelligence",
    "intresting": "interesting",
    "irresistable": "irresistible",
    "jellous": "jealous", "jelous": "jealous",
    "knowlege": "knowledge", "knoledge": "knowledge",
    "lenght": "length",
    "liason": "liaison", "liasion": "liaison",
    "libary": "library", "liberry": "library",
    "lisence": "license",
    "lonelyness": "loneliness",
    "maintainance": "maintenance", "maintanence": "maintenance", "maintnance": "maintenance",
    "managment": "management",
    "medeval": "medieval", "medeival": "medieval",
    "millenium": "millennium", "milennium": "millennium",
    "minature": "miniature",
    "mischevious": "mischievous", "mischevous": "mischievous",
    "mispell": "misspell", "misspel": "misspell",
    "necesary": "necessary", "neccessary": "necessary", "neccesary": "necessary",
    "noticable": "noticeable",
    "occassion": "occasion", "ocasion": "occasion",
    "occurence": "occurrence", "occurance": "occurrence", "occurrance": "occurrence",
    "offically": "officially",
    "optomistic": "optimistic",
    "parliment": "parliament", "parlimant": "parliament",
    "passtime": "pastime",
    "percieve": "perceive",
    "perserverance": "perseverance", "perseverence": "perseverance",
    "personel": "personnel",
    "pharmaseutical": "pharmaceutical", "farmaceutical": "pharmaceutical",
    "plagerism": "plagiarism", "plagarism": "plagiarism",
    "posession": "possession", "possesion": "possession", "posesion": "possession",
    "potatos": "potatoes",
    "privelege": "privilege", "priviledge": "privilege", "privlege": "privilege",
    "procede": "proceed",
    "pronounciation": "pronunciation", "pronuncation": "pronunciation",
    "publically": "publicly",
    "questionaire": "questionnaire", "questionairre": "questionnaire",
    "realy": "really",
    "recieve": "receive", "receve": "receive",
    "recomend": "recommend", "reccommend": "recommend", "reccomend": "recommend",
    "refrence": "reference", "referance": "reference",
    "relevent": "relevant", "relavent": "relevant",
    "religous": "religious",
    "remeber": "remember", "rember": "remember",
    "repitition": "repetition",
    "restaraunt": "restaurant", "resturant": "restaurant", "restraunt": "restaurant",
    "rythm": "rhythm", "rythym": "rhythm", "rhythym": "rhythm",
    "sargent": "sergeant",
    "saterday": "saturday",
    "scedule": "schedule", "schedual": "schedule", "shedule": "schedule",
    "seize": "seize",
    "sentance": "sentence",
    "seperate": "separate", "seprate": "separate",
    "sieze": "seize",
    "similer": "similar", "similiar": "similar",
    "sincerely": "sincerely",
    "speach": "speech",
    "strenght": "strength",
    "succesful": "successful", "successfull": "successful", "succesfull": "successful",
    "supercede": "supersede", "superceed": "supersede", "superseed": "supersede",
    "supress": "suppress",
    "surprize": "surprise",
    "tatoo": "tattoo",
    "temperture": "temperature", "tempreture": "temperature",
    "tendancy": "tendency",
    "threshhold": "threshold",
    "tommorow": "tomorrow", "tommorrow": "tomorrow", "tomorow": "tomorrow",
    "tounge": "tongue",
    "truely": "truly",
    "tyrany": "tyranny",
    "ubiqitus": "ubiquitous", "ubiqitous": "ubiquitous",
    "underate": "underrate",
    "untill": "until", "untl": "until",
    "unusuall": "unusual",
    "usefull": "useful",
    "vaccum": "vacuum", "vacume": "vacuum", "vaccuum": "vacuum",
    "vegatarian": "vegetarian",
    "vehical": "vehicle",
    "vengance": "vengeance",
    "visable": "visible",
    "wether": "whether",
    "wierd": "weird", "weerd": "weird",
    "wellfare": "welfare",
    "wensday": "wednesday",
    "withold": "withhold",
    "writting": "writing",
  }

  if (MISSPELLINGS[word]) {
    const correct = MISSPELLINGS[word]
    return NextResponse.json({
      word: correct,
      confidence: "close",
      dialects: DIALECT_DIFFERENCES[correct] || null,
    })
  }

  // Fuzzy match against dictionary
  let bestMatch = ""
  let bestDistance = Infinity

  // For performance, only check words of similar length
  const minLen = Math.max(1, word.length - 3)
  const maxLen = word.length + 3

  for (const dictWord of dictionary) {
    if (dictWord.length < minLen || dictWord.length > maxLen) continue
    const distance = levenshtein(word, dictWord)
    if (distance < bestDistance) {
      bestDistance = distance
      bestMatch = dictWord
    }
  }

  // Also check dialect words
  for (const dialectWord of Object.keys(DIALECT_DIFFERENCES)) {
    if (dialectWord.length < minLen || dialectWord.length > maxLen) continue
    const distance = levenshtein(word, dialectWord)
    if (distance < bestDistance) {
      bestDistance = distance
      bestMatch = dialectWord
    }
  }

  // Dynamic threshold based on word length
  const maxDistance = Math.max(2, Math.floor(word.length * 0.4))

  if (bestDistance <= 1) {
    return NextResponse.json({
      word: bestMatch,
      confidence: "close",
      dialects: DIALECT_DIFFERENCES[bestMatch] || null,
    })
  } else if (bestDistance <= maxDistance) {
    return NextResponse.json({
      word: bestMatch,
      confidence: "guess",
      dialects: DIALECT_DIFFERENCES[bestMatch] || null,
    })
  }

  return NextResponse.json({
    word: "",
    confidence: "none",
    dialects: null,
  })
}
