/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion } from '../types';

const RAW_CHAPTER_QUIZZES: { [chapterId: string]: QuizQuestion[] } = {
  p11_ch1: [
    {
      id: 'p11_ch1_q1',
      question: 'Which of the following physical quantities has the same dimensions as that of Energy?',
      options: ['Force', 'Power', 'Torque', 'Linear Momentum'],
      correctAnswerIndex: 2,
      explanation: 'Torque = Force x Distance, which has dimensions [M L² T⁻²]. Energy is also force x distance [M L² T⁻²]. Hence Torque and Energy have identical dimensional formulas.'
    },
    {
      id: 'p11_ch1_q2',
      question: 'If the error in measurement of radius of a sphere is 2%, what is the percentage error in its volume?',
      options: ['2%', '4%', '6%', '8%'],
      correctAnswerIndex: 2,
      explanation: 'Volume of sphere V = (4/3) * π * r³. Taking relative errs: ΔV/V = 3 * (Δr/r). Percentage error in volume = 3 * 2% = 6%.'
    },
    {
      id: 'p11_ch1_q3',
      question: 'The number of significant figures in 0.00760 is:',
      options: ['2', '3', '4', '5'],
      correctAnswerIndex: 1,
      explanation: 'Leading zeros are never significant. Trailing zeros after a decimal point are significant. Therefore, only the digits 7, 6, and 0 are significant, giving a total of 3 significant figures.'
    }
  ],
  p11_ch2: [
    {
      id: 'p11_ch2_q1',
      question: 'A body is thrown vertically upwards with velocity u. The maximum height reached is given by:',
      options: ['u / g', 'u² / g', 'u² / 2g', '2u / g'],
      correctAnswerIndex: 2,
      explanation: 'Using the third equation of motion: v² = u² - 2gh. At maximum height v = 0, so 0 = u² - 2gH => H = u² / 2g.'
    },
    {
      id: 'p11_ch2_q2',
      question: 'On a displacement-time graph, a horizontal line parallel to the time axis represents:',
      options: ['Uniform motion', 'Zero velocity (Rest)', 'Uniform acceleration', 'Constant acceleration'],
      correctAnswerIndex: 1,
      explanation: 'A horizontal line means displacement does not change over time. Thus, velocity is zero and the object is at rest.'
    }
  ],
  c11_ch1: [
    {
      id: 'c11_ch1_q1',
      question: 'What is the molarity of a solution containing 4g of NaOH dissolved in 250mL of water?',
      options: ['0.1 M', '0.4 M', '1.0 M', '2.0 M'],
      correctAnswerIndex: 1,
      explanation: 'Molecular weight of NaOH = 23 + 16 + 1 = 40 g/mol. Moles of NaOH = 4 / 40 = 0.1 mol. Volume = 250 mL = 0.25 L. Molarity = Moles / Volume = 0.1 / 0.25 = 0.4 M.'
    },
    {
      id: 'c11_ch1_q2',
      question: 'The mass of one mole of carbon-12 atoms is exactly:',
      options: ['1.66 x 10⁻²⁴ g', '12 g', '6.022 x 10²³ g', '1.99 x 10⁻²³ g'],
      correctAnswerIndex: 1,
      explanation: 'By definition, one mole of Carbon-12 isotopes has a mass of exactly 12 grams, containing Avogadro number of atoms.'
    }
  ],
  cs11_ch1: [
    {
      id: 'cs11_ch1_q1',
      question: 'Which CPU component is responsible for retrieving instructions from memory and processing them?',
      options: ['Arithmetic Logic Unit (ALU)', 'Control Unit (CU)', 'Input Unit', 'Secondary Storage'],
      correctAnswerIndex: 1,
      explanation: 'The Control Unit (CU) fetches instructions, decodes them, and controls the flow of signal instructions inside the system.'
    },
    {
      id: 'cs11_ch1_q2',
      question: 'What is the decimal representation of the binary number 1101?',
      options: ['11', '13', '15', '9'],
      correctAnswerIndex: 1,
      explanation: '1*2^3 + 1*2^2 + 0*2^1 + 1*2^0 = 8 + 4 + 0 + 1 = 13.'
    }
  ],
  m11_ch1: [
    {
      id: 'm11_ch1_q1',
      question: 'If set A has n elements, then the number of elements in the Power Set P(A) is:',
      options: ['n²', '2n', '2ⁿ', 'n!'],
      correctAnswerIndex: 2,
      explanation: 'The power set contains all possible subsets. The total number of subsets of a set containing n elements is 2ⁿ.'
    },
    {
      id: 'm11_ch1_q2',
      question: 'Which of the following represents the empty set ∅?',
      options: ['{ 0 }', '{ ∅ }', '{ x : x² + 1 = 0, x belongs to Real Numbers }', 'None of these'],
      correctAnswerIndex: 2,
      explanation: 'x² + 1 = 0 has solutions x = ±i, which are imaginary. There is no real number satisfying x² + 1 = 0. Thus, this builder represents an empty set.'
    }
  ],
  e11_ch1: [
    {
      id: 'e11_ch1_q1',
      question: 'Who is the author of the story "The Portrait of a Lady"?',
      options: ['Arundhati Roy', 'Khushwant Singh', 'Vikram Seth', 'Mul राजेंद्र'],
      correctAnswerIndex: 1,
      explanation: '"The Portrait of a Lady" is written by the celebrated Indian author, journalist, and diplomat Khushwant Singh.'
    },
    {
      id: 'e11_ch1_q2',
      question: 'What was the grandmother\'s daily pastime in the city house?',
      options: ['Feeding the sparrows', 'Knitting sweaters', 'Listening to English music', 'Reading the morning news'],
      correctAnswerIndex: 0,
      explanation: 'In the city, her touch with outdoor life was replaced by spinning wheel routines, saying prayers, and feeding hundreds of sparrows in the courtyard during afternoons.'
    }
  ],
  p12_ch1: [
    {
      id: 'p12_ch1_q1',
      question: 'If the distance between two charges is doubled, the electrostatic force between them becomes:',
      options: ['Double', 'Four times', 'Half', 'One-fourth'],
      correctAnswerIndex: 3,
      explanation: 'According to Coulomb\'s law, force F is inversely proportional to square of distance (1/r²). Doubling r makes force 1/(2)² = 1/4th.'
    },
    {
      id: 'p12_ch1_q2',
      question: 'The unit of electric flux is:',
      options: ['Newton/Coulomb', 'Volt-meter (V m)', 'Farad', 'Tesla'],
      correctAnswerIndex: 1,
      explanation: 'Electric flux Φ = E * A. Unit = (N/C) * m². Since Volt = N m / C, V * m = (N/C)*m². Hence electric flux unit is Volt-meter.'
    },
    {
      id: 'p12_ch1_q3',
      question: 'A charge Q is placed at the center of a cube. The electric flux coming out of any one face of the cube is:',
      options: ['Q / ε₀', 'Q / 6ε₀', '6Q / ε₀', 'Q / 2ε₀'],
      correctAnswerIndex: 1,
      explanation: 'Total flux from a closed cube = Q / ε₀ by Gauss law. A cube has 6 symmetric faces, so flux through any one single face is 1/6th of total = Q / 6ε₀.'
    }
  ],
  p12_ch2: [
    {
      id: 'p12_ch2_q1',
      question: 'On an equipotential surface, the work done in moving a test charge q through a distance s is:',
      options: ['q * V', 'Infinite', 'Zero', 'Depends on s'],
      correctAnswerIndex: 2,
      explanation: 'Work done W = q * ΔV. On an equipotential surface, potential is constant, so potential difference ΔV = 0. Therefore, Work Done is always zero.'
    },
    {
      id: 'p12_ch2_q2',
      question: 'If a dielectric slab of dielectric constant K is inserted between plates of a capacitor, its capacitance:',
      options: ['Decreases K times', 'Increases K times', 'Remains unchanged', 'Becomes zero'],
      correctAnswerIndex: 1,
      explanation: 'C = K * C₀. Inserting a dielectric of constant K improves capacitance factors directly by multiplying with K.'
    }
  ],
  c12_ch1: [
    {
      id: 'c12_ch1_q1',
      question: 'An example of a liquid solution showing negative deviation from Raoult\'s Law is:',
      options: ['Ethanol + Acetone', 'Benzene + Toluene', 'Chloroform + Acetone', 'Carbon tetrachloride + Chloroform'],
      correctAnswerIndex: 2,
      explanation: 'Chloroform and Acetone form intermolecular hydrogen bonds. The A-B interactions are stronger than A-A and B-B, decreasing escaping tendency and showing a negative deviation from Raoult\'s law.'
    },
    {
      id: 'c12_ch1_q2',
      question: 'Which of the following concentration parameters depends on temperature changes?',
      options: ['Molarity', 'Molality', 'Mole fraction', 'Mass percentage'],
      correctAnswerIndex: 0,
      explanation: 'Molarity = Moles / Volume of solution. Since volume expands or contracts with temperature, Molarity varies with temperature. Molality, mole fraction, and mass percentage are mass-based and constant.'
    }
  ],
  cs12_ch1: [
    {
      id: 'cs12_ch1_q1',
      question: 'In Python, which scoping lookup order is followed to resolve a variable?',
      options: ['Local, Global, Built-in, Enclosing', 'Local, Enclosing, Global, Built-in', 'Global, Local, Enclosing, Built-in', 'Built-in, Global, Enclosing, Local'],
      correctAnswerIndex: 1,
      explanation: 'Python checks namespace scope sequentially using the LEGB rule: Local, Enclosing (nested functions), Global (module level), then Built-in.'
    },
    {
      id: 'cs12_ch1_q2',
      question: 'Which keyword can be declared inside a local block of a function to change the value of a module-level variable?',
      options: ['global', 'nonlocal', 'local', 'extern'],
      correctAnswerIndex: 0,
      explanation: 'The global keyword maps the specified identifier to the module-level namespace scope, allowing edits inside function blocks.'
    }
  ],
  m12_ch1: [
    {
      id: 'm12_ch1_q1',
      question: 'For any square matrix A, the quantity (A - Aᵀ) is always more specifically:',
      options: ['Symmetric matrix', 'Skew-symmetric matrix', 'Identity matrix', 'Diagonal matrix'],
      correctAnswerIndex: 1,
      explanation: 'Let Y = A - Aᵀ. Taking transpose: Yᵀ = (A - Aᵀ)ᵀ = Aᵀ - A = -(A - Aᵀ) = -Y. Hence, Y is a skew-symmetric matrix.'
    },
    {
      id: 'm12_ch1_q2',
      question: 'If the determinant of a 3x3 matrix A is 5, then the determinant of 2A is equal to:',
      options: ['10', '20', '40', '5'],
      correctAnswerIndex: 2,
      explanation: 'For an n x n matrix, |k * A| = kⁿ * |A|. Since n=3 and k=2, |2A| = 2³ * |A| = 8 * 5 = 40.'
    }
  ],
  m12_ch2: [
    {
      id: 'm12_ch2_q1',
      question: 'Evaluate the definite integral ∫ from 0 to π/2 of [ sin(x) / (sin(x) + cos(x)) ] dx:',
      options: ['π', 'π/2', 'π/4', '0'],
      correctAnswerIndex: 2,
      explanation: 'Using property: ∫ a to b f(x) dx = ∫ a to b f(a+b-x) dx. The integral transforms and when added to original yields 2I = ∫ 0 to π/2 1 dx = π/2, so I = π/4.'
    }
  ],
  e12_ch1: [
    {
      id: 'e12_ch1_q1',
      question: 'Who is the author of the story "The Last Lesson"?',
      options: ['Anees Jung', 'Alphonse Daudet', 'William Douglas', 'Louis Fischer'],
      correctAnswerIndex: 1,
      explanation: '"The Last Lesson" is written by the famous French novelist and short-story writer Alphonse Daudet.'
    },
    {
      id: 'e12_ch1_q2',
      question: 'What message was written on the blackboard by M. Hamel at the close of class?',
      options: ['Adieu Franz', 'Finis', 'Vive La France', 'German is Best'],
      correctAnswerIndex: 2,
      explanation: 'With a heavy heart, M. Hamel took a piece of chalk and wrote on the board, as large as he could: "Vive La France!" (Long Live France).'
    }
  ]
};

function generateQuizForChapter(chapterId: string): QuizQuestion[] {
  const existing = RAW_CHAPTER_QUIZZES[chapterId] || [];
  const list = [...existing];
  
  const isPhys = chapterId.startsWith('p');
  const isChem = chapterId.startsWith('c') && !chapterId.startsWith('cs');
  const isCS = chapterId.startsWith('cs');
  const isMath = chapterId.startsWith('m');
  const isBio = chapterId.startsWith('b');
  const isEng = chapterId.startsWith('e');
  
  while (list.length < 10) {
    const qIdx = list.length + 1;
    let question = "";
    let options: string[] = [];
    let correctAnswerIndex = 0;
    let explanation = "";

    if (isPhys) {
      if (qIdx === 1) {
        question = "What is the primary physical unit used for representing work under SI directives?";
        options = ["Newton", "Joule", "Watt", "Pascal"];
        correctAnswerIndex = 1;
        explanation = "The SI unit of work and energy is the Joule (J), which equals one Newton-meter.";
      } else if (qIdx === 2) {
        question = "A vector quantity possesses:";
        options = ["Magnitude only", "Direction only", "Both magnitude and direction", "Neither magnitude nor direction"];
        correctAnswerIndex = 2;
        explanation = "Vectors have both magnitude physical size and direction, following vector laws of addition.";
      } else if (qIdx === 3) {
        question = "What happens to the resistance of a metallic conductor when its absolute temperature rises?";
        options = ["Decreases", "Increases", "Remains unchanged", "Becomes zero"];
        correctAnswerIndex = 1;
        explanation = "As temperature increases, thermal vibration of metal ions enhances, magnifying resistance to charge flow.";
      } else if (qIdx === 4) {
        question = "The escape velocity corresponding to Earth's surface gravity is approximately:";
        options = ["9.8 km/s", "11.2 km/s", "7.9 km/s", "15.0 km/s"];
        correctAnswerIndex = 1;
        explanation = "Escape velocity represents the minimum launch speed required to escape planetary pull, which is ~11.2 km/s for Earth.";
      } else if (qIdx === 5) {
        question = "Which law governs the electromagnetic force between two stationary point charges?";
        options = ["Biot-Savart Law", "Coulomb's Law", "Faraday's Law", "Ampere's Law"];
        correctAnswerIndex = 1;
        explanation = "Coulomb's Law dictates that electrostatic force varies directly with charges product and inversely with separation square.";
      } else if (qIdx === 6) {
        question = "Identify the parameter that is conserved during elastic collisions:";
        options = ["Kinetic energy only", "Linear Momentum only", "Both Linear Momentum and Kinetic Energy", "None of the above"];
        correctAnswerIndex = 2;
        explanation = "In elastic collisions, both total linear momentum and total kinetic energy of the particles systems are conserved.";
      } else if (qIdx === 7) {
        question = "What frequency band is typically allocated for commercial FM radio transmissions?";
        options = ["540-1600 kHz", "88-108 MHz", "3-30 MHz", "1-10 GHz"];
        correctAnswerIndex = 1;
        explanation = "Commercial FM radio signals operate in the Very High Frequency (VHF) band between 88 and 108 MHz.";
      } else if (qIdx === 8) {
        question = "The refractive index of vacuum represents exactly:";
        options = ["0.0", "1.0", "1.5", "1.33"];
        correctAnswerIndex = 1;
        explanation = "The refractive index of vacuum is defined as exactly 1.0, and air is very close at ~1.0003.";
      } else if (qIdx === 9) {
        question = "Which subatomic particle carries a negative fundamental electrical charge?";
        options = ["Proton", "Neutron", "Electron", "Positron"];
        correctAnswerIndex = 2;
        explanation = "The electron carries a negative charge of -1.602 x 10⁻¹⁹ C, which forms the basis of electrical conductivity currents.";
      } else {
        question = "What represents the power of a physical system executing one joule of work per second?";
        options = ["One Watt", "One Horsepower", "One Joule", "One Volt"];
        correctAnswerIndex = 0;
        explanation = "Power is work per unit time. 1 Watt = 1 Joule per second (J/s).";
      }
    } else if (isChem) {
      if (qIdx === 1) {
        question = "What corresponds to the molecular mass in grams of exactly one mole of H2O?";
        options = ["1.008 g", "16.00 g", "18.015 g", "32.00 g"];
        correctAnswerIndex = 2;
        explanation = "Molar mass of water = (2 * 1.008) + 15.999 = ~18.015 grams per mole.";
      } else if (qIdx === 2) {
        question = "Which state has a pH metric of exactly 7.0 at 298 Kelvin temperature?";
        options = ["Pure acidic buffer", "Pure water (Neutral)", "Concd sodium hydroxide", "Hydrochloric acid"];
        correctAnswerIndex = 1;
        explanation = "Pure neutral water at room temp (298 K) has equal concentrations of H⁺ and OH⁻ ions, resulting in pH equal to 7.0.";
      } else if (qIdx === 3) {
        question = "Identify the chemical bond created by mutual sharing of electron pairs:";
        options = ["Ionic bond", "Covalent bond", "Hydrogen bond", "Metallic bond"];
        correctAnswerIndex = 1;
        explanation = "Covalent bonds represent stable architectures formed when nonmetal atoms share valence shell electrons.";
      } else if (qIdx === 4) {
        question = "What represents the oxidation state of element oxygen in the peroxide compound sodium peroxide (Na2O2)?";
        options = ["-2", "-1", "0", "+2"];
        correctAnswerIndex = 1;
        explanation = "In peroxides like Na2O2 or H2O2, each oxygen atom exhibits an anomalous oxidation state of -1.";
      } else if (qIdx === 5) {
        question = "Which ideal gas law parameter is held constant under Boyle's law guidelines?";
        options = ["Pressure", "Volume", "Temperature and moles amount", "Entropy"];
        correctAnswerIndex = 2;
        explanation = "Boyles Law establishes that for fixed moles of gas at constant temperature, pressure varies inversely with volume.";
      } else if (qIdx === 6) {
        question = "What substance is termed a universal solvent owing to its high dielectric constant properties?";
        options = ["Ethanol", "Liquid Acetone", "Water", "Benzene"];
        correctAnswerIndex = 2;
        explanation = "Water is a polar molecule with a high dielectric constant (~80), allowing it to dissolve diverse ionic and polar solutes.";
      } else if (qIdx === 7) {
        question = "What represents the key organic compound class containing the characteristic carbon-carbon triple bond?";
        options = ["Alkanes", "Alkenes", "Alkynes", "Arenes"];
        correctAnswerIndex = 2;
        explanation = "Alkynes are unsaturated acyclic hydrocarbons with at least one C≡C triple bond in their main chain.";
      } else if (qIdx === 8) {
        question = "What acts as the thermodynamic criterion for any spontaneous process at constant temperature and pressure?";
        options = ["ΔG > 0", "ΔG = 0", "ΔG < 0", "ΔS < 0"];
        correctAnswerIndex = 2;
        explanation = "A negative Gibbs Free Energy change (ΔG < 0) represents the necessary thermodynamic driving criterion for spontaneity.";
      } else if (qIdx === 9) {
        question = "Which catalyst is historically transition-metal based for synthesizing Ammonia via Haber's guidelines?";
        options = ["Nickel", "Iron", "Platinum", "Copper"];
        correctAnswerIndex = 1;
        explanation = "Finely divided Iron (Fe) with molybdenum as promoter acts as the standard industrial catalyst for manufacturing Ammonia.";
      } else {
        question = "Which element exhibits the highest absolute electronegativity on the Pauling scale?";
        options = ["Oxygen", "Fluorine", "Chlorine", "Nitrogen"];
        correctAnswerIndex = 1;
        explanation = "Fluorine holds the maximum value of electronegativity (4.0) among all elements in the periodic system.";
      }
    } else if (isCS) {
      if (qIdx === 1) {
        question = "Which data collection is defined as an immutable sequence in the Python language?";
        options = ["List", "Dictionary", "Tuple", "Set"];
        correctAnswerIndex = 2;
        explanation = "Tuples are immutable sequence types in Python, meaning values cannot be altered once initialized.";
      } else if (qIdx === 2) {
        question = "What represents the computational complexity of searching an element inside a sorted array using Binary Search?";
        options = ["O(1)", "O(N)", "O(log N)", "O(N log N)"];
        correctAnswerIndex = 2;
        explanation = "Binary search divides the searching segment in half each step, leading to logarithmic O(log N) operations.";
      } else if (qIdx === 3) {
        question = "Which SQL clause is used to filter records generated by grouping aggregates?";
        options = ["WHERE", "HAVING", "GROUP BY", "ORDER BY"];
        correctAnswerIndex = 1;
        explanation = "HAVING filters grouped aggregates, whereas WHERE filters individual rows prior to grouping.";
      } else if (qIdx === 4) {
        question = "Which module-level keyword retrieves values of global context variables inside localized function blocks?";
        options = ["nonlocal", "global", "static", "local"];
        correctAnswerIndex = 1;
        explanation = "The global statement signals Python to look up and change identifiers declared at the global module level.";
      } else if (qIdx === 5) {
        question = "What protocol standard translates domain names like google.com into corresponding numeric IP routes?";
        options = ["HTTP", "DNS", "TCP", "FTP"];
        correctAnswerIndex = 1;
        explanation = "Domain Name System (DNS) maps human-friendly strings to machine-readable destination IP addresses.";
      } else if (qIdx === 6) {
        question = "Which Python method inserts an item to the extreme rear boundary of an instantiated list?";
        options = ["prepend", "insert", "append", "extend"];
        correctAnswerIndex = 2;
        explanation = "The append() list method adds elements systematically at index position N (at the end of lists).";
      } else if (qIdx === 7) {
        question = "Which Python utility package manages serializing object variables to binary disks (Pickling)?";
        options = ["math", "sys", "json", "pickle"];
        correctAnswerIndex = 3;
        explanation = "The pickle standard module performs binary storage serialization of complex python objects on disks.";
      } else if (qIdx === 8) {
        question = "What memory storage system represents the Last-In-First-Out (LIFO) architectural policy?";
        options = ["Queue", "Binary Tree", "Stack", "Graph"];
        correctAnswerIndex = 2;
        explanation = "A stack is a linear collection governed by LIFO rules, using push and pop operations exclusively at the top pointer.";
      } else if (qIdx === 9) {
        question = "Which SQL command deletes all data rows from a table while preserving its structural framework?";
        options = ["DROP TABLE", "DELETE TABLE", "TRUNCATE TABLE", "REMOVE TABLE"];
        correctAnswerIndex = 2;
        explanation = "TRUNCATE TABLE releases storage pages and clears all database records quickly while keeping the table outline schema intact.";
      } else {
        question = "What is the key binary equivalence of the decimal number 8?";
        options = ["1000", "0111", "0011", "1010"];
        correctAnswerIndex = 0;
        explanation = "Decimal 8 equates to 1 x 2^3 + 0 x 2^2 + 0 x 2^1 + 0 x 2^0, which is binary 1000.";
      }
    } else if (isMath) {
      if (qIdx === 1) {
        question = "If subset mapping f has a single matching output for every distinct input, f is defined as:";
        options = ["Many-to-one function", "One-to-one function (Injective)", "Onto function (Surjective)", "Bijective identity"];
        correctAnswerIndex = 1;
        explanation = "An injective or one-to-one function maps distinct domain coordinates to distinct ranges in codomains.";
      } else if (qIdx === 2) {
        question = "What corresponds to the determinant value of an identity matrix of dimension 3x3?";
        options = ["0", "1", "3", "-1"];
        correctAnswerIndex = 1;
        explanation = "An identity matrix contains ones along main diagonal and zeros elsewhere; its determinant is always exactly 1.0.";
      } else if (qIdx === 3) {
        question = "What is the derivative of the natural log function ln(x) evaluated at coordinate x?";
        options = ["1 / x", "e^x", "x * ln(x)", "1 / x²"];
        correctAnswerIndex = 0;
        explanation = "Calculus limits prove that d/dx [ln(x)] = 1/x for all positive real numbers domain bounds.";
      } else if (qIdx === 4) {
        question = "What is the sum of probabilities of all mutually exclusive events in any sample space?";
        options = ["0.0", "0.5", "1.0", "Infinite"];
        correctAnswerIndex = 2;
        explanation = "By axioms of probability, the sum of all probability events inside any system must balance to exactly 1.0.";
      } else if (qIdx === 5) {
        question = "An equation of degree two representing a circle has equal coefficients for:";
        options = ["x and y terms", "x² and y² terms with zero xy coefficient", "xy factor only", "Constant factor"];
        correctAnswerIndex = 1;
        explanation = "Circles require ax² + ay² + 2gx + 2fy + c = 0, where coefficients of x² and y² are equal and coefficient of xy is zero.";
      } else if (qIdx === 6) {
        question = "Evaluate the derivative of constant function f(x) = 156 with respect to x:";
        options = ["0", "156", "1", "156x"];
        correctAnswerIndex = 0;
        explanation = "The rate of change or derivative of any constant system value is always exactly zero.";
      } else if (qIdx === 7) {
        question = "Find the slope of a line which is parallel to the horizontal x-coordinate axis:";
        options = ["Infinite", "0", "1", "-1"];
        correctAnswerIndex = 1;
        explanation = "A horizontal line parallel to the x-axis has a slope of tan(0°) = 0.";
      } else if (qIdx === 8) {
        question = "What represented power of exponent holds the expansion of the binomial (a + b)ⁿ?";
        options = ["n terms", "n - 1 terms", "n + 1 terms", "2n terms"];
        correctAnswerIndex = 2;
        explanation = "The binomial expansion of (a + b)ⁿ has exactly n+1 terms.";
      } else if (qIdx === 9) {
        question = "What represents the dot vector scalar product of two mutually perpendicular vectors?";
        options = ["Product of magnitudes", "Zero", "One", "Negative unity"];
        correctAnswerIndex = 1;
        explanation = "Since A * B = |A||B| cos(θ), and cos(90°) = 0, the dot product of orthogonal vectors is exactly zero.";
      } else {
        question = "What corresponds to the arithmetic mean of the numbers 10, 20, and 30?";
        options = ["10", "15", "20", "25"];
        correctAnswerIndex = 2;
        explanation = "Arithmetic Mean = (10 + 20 + 30) / 3 = 60 / 3 = 20.";
      }
    } else if (isBio) {
      if (qIdx === 1) {
        question = "Which cellular organelle is responsible for synthesizing ATP during oxidative processes?";
        options = ["Ribosome", "Mitochondria", "Lysosome", "Golgi complex"];
        correctAnswerIndex = 1;
        explanation = "Mitochondria are the powerhouses of the cell, carrying out the Krebs cycle and the electron transport chain to synthesize ATP.";
      } else if (qIdx === 2) {
        question = "What forms the basic repeating subunit of chromatin in eukaryotic nucleic bundles?";
        options = ["Centromere", "Nucleosome", "Ribosome", "Plasmid"];
        correctAnswerIndex = 1;
        explanation = "A nucleosome features positively charged histone protein octamers wound around by negative DNA strands.";
      } else if (qIdx === 3) {
        question = "Which kingdom includes prokaryotic unicellular specimens like E. coli under biological classification grids?";
        options = ["Monera", "Protista", "Fungi", "Plantae"];
        correctAnswerIndex = 0;
        explanation = "Prokaryotic single-celled organisms lacking nuclear bounds are assigned to the Kingdom Monera.";
      } else if (qIdx === 4) {
        question = "What corresponds to the oxygen-carrying red pigment in human blood cells?";
        options = ["Chlorophyll", "Hemoglobin", "Myoglobin", "Hemocyanin"];
        correctAnswerIndex = 1;
        explanation = "Hemoglobin is an iron-rich protein in red blood cells that reversibly binds oxygen to deliver it to tissues.";
      } else if (qIdx === 5) {
        question = "Which hormone, often called the stress hormone, is synthesized by modern mammalian adrenal glands?";
        options = ["Insulin", "Thyroxine", "Cortisol", "Adrenaline"];
        correctAnswerIndex = 2;
        explanation = "Cortisol represents the major glucocorticoid synthesized by adrenal cortex responses to manage metabolic stressors.";
      } else if (qIdx === 6) {
        question = "The primary green pigment driving light capture inside chloroplasts during photosynthesis is:";
        options = ["Carotenoid", "Xanthophyll", "Chlorophyll a", "Anthocyanin"];
        correctAnswerIndex = 2;
        explanation = "Chlorophyll a is the essential light reaction pigment capturing blue/red wavelengths during the Z-scheme.";
      } else if (qIdx === 7) {
        question = "Which cell division phase is characterized by chromosomes aligning along equatorial plates?";
        options = ["Prophase", "Metaphase", "Anaphase", "Telophase"];
        correctAnswerIndex = 1;
        explanation = "During metaphase, spindle fibers align chromosomes perfectly inline along the central equatorial plate coordinates.";
      } else if (qIdx === 8) {
        question = "Who is known as the father of modern evolutionary genetics following pea plant cross hybrids research?";
        options = ["Charles Darwin", "Gregor Mendel", "Jean-Baptiste Lamarck", "Hugo de Vries"];
        correctAnswerIndex = 1;
        explanation = "Gregor Johann Mendel formulated the laws of inheritance (Segregation, Independent Assortment) tracking pea traits.";
      } else if (qIdx === 9) {
        question = "Which molecular enzyme is used in PCR technology to replicate DNA at high thermal boundaries?";
        options = ["DNA Ligase", "RNA Polymerase", "Taq Polymerase", "Restriction Endonuclease"];
        correctAnswerIndex = 2;
        explanation = "Taq Polymerase is isolated from Thermus aquaticus bacteria, working stably under extreme temperatures to extend primers.";
      } else {
        question = "What biological process represents the loss of water vapor from the leaves of flowering plants?";
        options = ["Respiration", "Transpiration", "Guttation", "Osmosis"];
        correctAnswerIndex = 1;
        explanation = "Transpiration is the evaporation of surplus water from leaves via stomata, drawing mineral streams up roots.";
      }
    } else {
      if (qIdx === 1) {
        question = "What is the primary literary theme explored in Alphonse Daudet's story 'The Last Lesson'?";
        options = ["Industrial Revolution", "Linguistic Chauvinism and Patriotism", "Space travel boundaries", "Religious conflicts"];
        correctAnswerIndex = 1;
        explanation = "Alphonse Daudet demonstrates how linguistic nationalism and preserving native language protects native heritage during foreign conquest.";
      } else if (qIdx === 2) {
        question = "Identify the figure of speech: 'The mother looked as pale as a late winter's moon.'";
        options = ["Metaphor", "Simile", "Personification", "Hyperbole"];
        correctAnswerIndex = 1;
        explanation = "Using comparison indicators like 'as' or 'like' establishes a clear Simile.";
      } else if (qIdx === 3) {
        question = "In 'The Portrait of a Lady', which birds joined the funeral to mourn grandmother?";
        options = ["Pigeons", "Crows", "Sparrows", "Parrots"];
        correctAnswerIndex = 2;
        explanation = "Thousands of sparrows sat quietly in the courtyard, refraining from chattering, mourning her death.";
      } else if (qIdx === 4) {
        question = "Which punctuation mark is used to connect independent clauses without coordinating conjunctions?";
        options = ["Comma", "Semicolon", "Hyphen", "Apostrophe"];
        correctAnswerIndex = 1;
        explanation = "Semicolons connect related independent clauses, maintaining prose rhythm.";
      } else if (qIdx === 5) {
        question = "Identify the antonym of the vocabulary item 'Zenith':";
        options = ["Nadir", "Peak", "Summit", "Apex"];
        correctAnswerIndex = 0;
        explanation = "Zenith represents the peak or highest point; Nadir represents the lowest point.";
      } else if (qIdx === 6) {
        question = "Which element details the main summary plot of Anees Jung's 'Lost Spring' collection?";
        options = ["Wild animal conservation", "The physical tragedy of impoverished childhood and lost dreams", "Climbing mount Everest", "Space research lab diaries"];
        correctAnswerIndex = 1;
        explanation = "Lost Spring depicts poor children in Seemapuri/Firozabad forced into early labor, losing their bright childhood.";
      } else if (qIdx === 7) {
        question = "What literary device involves attributing human traits to non-human specimens?";
        options = ["Alliteration", "Onomatopoeia", "Personification", "Oxymoron"];
        correctAnswerIndex = 2;
        explanation = "Personification assigns human emotions or features to inanimate objects or natural elements.";
      } else if (qIdx === 8) {
        question = "In English, what is the passive voice of: 'The student wrote the homework.'?";
        options = ["The homework was written by the student.", "The homework was writing by the student.", "The homework is written by the student.", "The student has written the homework."];
        correctAnswerIndex = 0;
        explanation = "Simple past passive form is: Subject + was/were + past participle (written) + by Agent.";
      } else if (qIdx === 9) {
        question = "Who wrote the profound call for introspective quietness and harmony: 'Keeping Quiet'?";
        options = ["Kamala Das", "Pablo Neruda", "John Keats", "Robert Frost"];
        correctAnswerIndex = 1;
        explanation = "Pablo Neruda authored 'Keeping Quiet', emphasizing mutual understanding, silence, and eco-harmony.";
      } else {
        question = "Identify the synonym of the word 'Pristine':";
        options = ["Damaged", "Spoiled", "Immaculate/Pure", "Modern"];
        correctAnswerIndex = 2;
        explanation = "Pristine describes something in its original, pure, untouched, and clean state.";
      }
    }

    list.push({
      id: `${chapterId}_pad_q${qIdx}`,
      question,
      options,
      correctAnswerIndex,
      explanation
    });
  }

  return list;
}

export const CHAPTER_QUIZZES = new Proxy(RAW_CHAPTER_QUIZZES, {
  get(target, prop: string) {
    if (typeof prop === 'string') {
      if (!target[prop]) {
        target[prop] = generateQuizForChapter(prop);
      } else if (target[prop].length < 10) {
        target[prop] = generateQuizForChapter(prop);
      }
      return target[prop];
    }
    return (target as any)[prop];
  }
});
