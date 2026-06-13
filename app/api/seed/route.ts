import { NextResponse } from "next/server";
import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// =============================================
// ATTRIBUTE TAXONOMY
// =============================================
const attributeMap: Record<ExerciseAttributeNameEnum, ExerciseAttributeValueEnum[]> = {
  [ExerciseAttributeNameEnum.TYPE]: [
    ExerciseAttributeValueEnum.BODYWEIGHT,
    ExerciseAttributeValueEnum.STRENGTH,
    ExerciseAttributeValueEnum.POWERLIFTING,
    ExerciseAttributeValueEnum.CALISTHENIC,
    ExerciseAttributeValueEnum.PLYOMETRICS,
    ExerciseAttributeValueEnum.STRETCHING,
    ExerciseAttributeValueEnum.STRONGMAN,
    ExerciseAttributeValueEnum.CARDIO,
    ExerciseAttributeValueEnum.STABILIZATION,
    ExerciseAttributeValueEnum.POWER,
    ExerciseAttributeValueEnum.RESISTANCE,
    ExerciseAttributeValueEnum.CROSSFIT,
    ExerciseAttributeValueEnum.WEIGHTLIFTING,
  ],
  [ExerciseAttributeNameEnum.PRIMARY_MUSCLE]: [
    ExerciseAttributeValueEnum.BICEPS,
    ExerciseAttributeValueEnum.SHOULDERS,
    ExerciseAttributeValueEnum.CHEST,
    ExerciseAttributeValueEnum.BACK,
    ExerciseAttributeValueEnum.GLUTES,
    ExerciseAttributeValueEnum.TRICEPS,
    ExerciseAttributeValueEnum.HAMSTRINGS,
    ExerciseAttributeValueEnum.QUADRICEPS,
    ExerciseAttributeValueEnum.FOREARMS,
    ExerciseAttributeValueEnum.CALVES,
    ExerciseAttributeValueEnum.TRAPS,
    ExerciseAttributeValueEnum.ABDOMINALS,
    ExerciseAttributeValueEnum.NECK,
    ExerciseAttributeValueEnum.LATS,
    ExerciseAttributeValueEnum.ADDUCTORS,
    ExerciseAttributeValueEnum.ABDUCTORS,
    ExerciseAttributeValueEnum.OBLIQUES,
    ExerciseAttributeValueEnum.GROIN,
    ExerciseAttributeValueEnum.FULL_BODY,
    ExerciseAttributeValueEnum.ROTATOR_CUFF,
    ExerciseAttributeValueEnum.HIP_FLEXOR,
    ExerciseAttributeValueEnum.ACHILLES_TENDON,
    ExerciseAttributeValueEnum.FINGERS,
  ],
  [ExerciseAttributeNameEnum.SECONDARY_MUSCLE]: [
    ExerciseAttributeValueEnum.BICEPS,
    ExerciseAttributeValueEnum.SHOULDERS,
    ExerciseAttributeValueEnum.CHEST,
    ExerciseAttributeValueEnum.BACK,
    ExerciseAttributeValueEnum.GLUTES,
    ExerciseAttributeValueEnum.TRICEPS,
    ExerciseAttributeValueEnum.HAMSTRINGS,
    ExerciseAttributeValueEnum.QUADRICEPS,
    ExerciseAttributeValueEnum.FOREARMS,
    ExerciseAttributeValueEnum.CALVES,
    ExerciseAttributeValueEnum.TRAPS,
    ExerciseAttributeValueEnum.ABDOMINALS,
    ExerciseAttributeValueEnum.NECK,
    ExerciseAttributeValueEnum.LATS,
    ExerciseAttributeValueEnum.ADDUCTORS,
    ExerciseAttributeValueEnum.ABDUCTORS,
    ExerciseAttributeValueEnum.OBLIQUES,
    ExerciseAttributeValueEnum.GROIN,
    ExerciseAttributeValueEnum.FULL_BODY,
    ExerciseAttributeValueEnum.ROTATOR_CUFF,
    ExerciseAttributeValueEnum.HIP_FLEXOR,
    ExerciseAttributeValueEnum.ACHILLES_TENDON,
    ExerciseAttributeValueEnum.FINGERS,
  ],
  [ExerciseAttributeNameEnum.EQUIPMENT]: [
    ExerciseAttributeValueEnum.DUMBBELL,
    ExerciseAttributeValueEnum.KETTLEBELLS,
    ExerciseAttributeValueEnum.BARBELL,
    ExerciseAttributeValueEnum.SMITH_MACHINE,
    ExerciseAttributeValueEnum.BODY_ONLY,
    ExerciseAttributeValueEnum.OTHER,
    ExerciseAttributeValueEnum.BANDS,
    ExerciseAttributeValueEnum.EZ_BAR,
    ExerciseAttributeValueEnum.MACHINE,
    ExerciseAttributeValueEnum.DESK,
    ExerciseAttributeValueEnum.PULLUP_BAR,
    ExerciseAttributeValueEnum.NONE,
    ExerciseAttributeValueEnum.CABLE,
    ExerciseAttributeValueEnum.MEDICINE_BALL,
    ExerciseAttributeValueEnum.SWISS_BALL,
    ExerciseAttributeValueEnum.FOAM_ROLL,
    ExerciseAttributeValueEnum.WEIGHT_PLATE,
    ExerciseAttributeValueEnum.TRX,
    ExerciseAttributeValueEnum.BOX,
    ExerciseAttributeValueEnum.ROPES,
    ExerciseAttributeValueEnum.SPIN_BIKE,
    ExerciseAttributeValueEnum.STEP,
    ExerciseAttributeValueEnum.BOSU,
    ExerciseAttributeValueEnum.TYRE,
    ExerciseAttributeValueEnum.SANDBAG,
    ExerciseAttributeValueEnum.POLE,
    ExerciseAttributeValueEnum.BENCH,
    ExerciseAttributeValueEnum.WALL,
    ExerciseAttributeValueEnum.BAR,
    ExerciseAttributeValueEnum.RACK,
    ExerciseAttributeValueEnum.CAR,
    ExerciseAttributeValueEnum.SLED,
    ExerciseAttributeValueEnum.CHAIN,
    ExerciseAttributeValueEnum.SKIERG,
    ExerciseAttributeValueEnum.ROPE,
    ExerciseAttributeValueEnum.NA,
  ],
  [ExerciseAttributeNameEnum.MECHANICS_TYPE]: [
    ExerciseAttributeValueEnum.ISOLATION,
    ExerciseAttributeValueEnum.COMPOUND,
  ],
};

// =============================================
// COMPREHENSIVE EXERCISE DATABASE
// Covers: CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, QUADRICEPS,
// HAMSTRINGS, GLUTES, ABDOMINALS, LATS, CALVES, FOREARMS, TRAPS
// Equipment: BARBELL, DUMBBELL, CABLE, MACHINE, BODY_ONLY, PULLUP_BAR, BENCH, KETTLEBELLS
// =============================================
interface ExerciseData {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  fullVideoUrl: string | null;
  fullVideoImageUrl: string | null;
  introduction: string;
  introductionEn: string;
  slug: string;
  slugEn: string;
  attributes: { attributeName: string; attributeValue: string }[];
}

const sampleExercises: ExerciseData[] = [
  // ==================== CHEST ====================
  {
    name: "Développé couché à la barre",
    nameEn: "Barbell Bench Press",
    description: '<p>Allongez-vous sur un banc plat, les pieds à plat au sol. Saisissez la barre avec une prise plus large que les épaules. Descendez la barre jusqu\'à la poitrine, puis poussez pour revenir à la position de départ.</p>',
    descriptionEn: '<p>Lie flat on a bench with feet flat on the floor. Grip the bar wider than shoulder width. Lower the bar to your chest, then push back up to the starting position.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/rT7DgCr-3t4?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/rT7DgCr-3t4/hqdefault.jpg",
    introduction: '<p>Le <strong>développé couché à la barre</strong> est l\'exercice roi pour la <strong>poitrine</strong>. Il sollicite également les <strong>triceps</strong> et les <strong>épaules</strong>.</p>',
    introductionEn: '<p>The <strong>barbell bench press</strong> is the king of <strong>chest</strong> exercises. It also engages the <strong>triceps</strong> and <strong>shoulders</strong>.</p>',
    slug: "developpe-couche-barre",
    slugEn: "barbell-bench-press",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "TRICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Développé couché aux haltères",
    nameEn: "Dumbbell Bench Press",
    description: '<p>Allongez-vous sur un banc plat avec un haltère dans chaque main. Descendez les haltères jusqu\'aux côtés de la poitrine, puis poussez vers le haut en joignant les haltères au-dessus de la poitrine.</p>',
    descriptionEn: '<p>Lie flat on a bench with a dumbbell in each hand. Lower the dumbbells to the sides of your chest, then push them up bringing them together above your chest.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/VMgxeX5Fbw4?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/VMgxeX5Fbw4/hqdefault.jpg",
    introduction: '<p>Le <strong>développé couché aux haltères</strong> permet une amplitude plus grande et travaille chaque côté indépendamment pour une meilleure symétrie de la <strong>poitrine</strong>.</p>',
    introductionEn: '<p>The <strong>dumbbell bench press</strong> allows a greater range of motion and works each side independently for better <strong>chest</strong> symmetry.</p>',
    slug: "developpe-couche-halteres",
    slugEn: "dumbbell-bench-press",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "TRICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Écartés aux haltères",
    nameEn: "Dumbbell Fly",
    description: '<p>Allongez-vous sur un banc avec un haltère dans chaque main au-dessus de la poitrine. Ouvrez les bras sur les côtés avec une légère flexion des coudes, puis ramenez les haltères au-dessus de la poitrine.</p>',
    descriptionEn: '<p>Lie on a bench with a dumbbell in each hand above your chest. Open your arms to the sides with a slight bend in the elbows, then bring the dumbbells back above your chest.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Les <strong>écartés aux haltères</strong> sont un exercice d\'isolation efficace pour étirer et contracter les <strong>pectoraux</strong>.</p>',
    introductionEn: '<p><strong>Dumbbell flyes</strong> are an effective isolation exercise for stretching and contracting the <strong>chest</strong> muscles.</p>',
    slug: "ecartes-halteres",
    slugEn: "dumbbell-fly",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Développé incliné aux haltères",
    nameEn: "Incline Dumbbell Press",
    description: '<p>Allongez-vous sur un banc incliné à 30-45 degrés avec un haltère dans chaque main. Descendez les haltères vers le haut de la poitrine puis poussez vers le haut.</p>',
    descriptionEn: '<p>Lie on an incline bench at 30-45 degrees with a dumbbell in each hand. Lower the dumbbells to the upper chest then push up.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>développé incliné aux haltères</strong> cible la partie supérieure des <strong>pectoraux</strong> pour un développement complet de la poitrine.</p>',
    introductionEn: '<p>The <strong>incline dumbbell press</strong> targets the upper <strong>chest</strong> for complete pectoral development.</p>',
    slug: "developpe-incline-halteres",
    slugEn: "incline-dumbbell-press",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Pompes",
    nameEn: "Push-Ups",
    description: '<p>Placez les mains au sol un peu plus large que les épaules. Le corps doit être aligné de la tête aux pieds. Descendez en pliant les bras jusqu\'à ce que la poitrine frôle le sol, puis poussez pour revenir.</p>',
    descriptionEn: '<p>Place your hands on the floor slightly wider than shoulder width. Keep your body straight from head to feet. Lower yourself by bending your arms until your chest nearly touches the floor, then push back up.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/IODxDxX7oi4?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg",
    introduction: '<p>Les <strong>pompes</strong> sont un exercice classique au poids du corps qui travaille les <strong>pectoraux</strong>, les <strong>triceps</strong> et les <strong>épaules</strong>.</p>',
    introductionEn: '<p><strong>Push-ups</strong> are a classic bodyweight exercise that works the <strong>chest</strong>, <strong>triceps</strong>, and <strong>shoulders</strong>.</p>',
    slug: "pompes",
    slugEn: "push-ups",
    attributes: [
      { attributeName: "TYPE", attributeValue: "BODYWEIGHT" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "TRICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "EQUIPMENT", attributeValue: "BODY_ONLY" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Pull-over à la barre",
    nameEn: "Barbell Pullover",
    description: '<p>Allongez-vous sur un banc, tenez une barre au-dessus de la poitrine. Abaissez la barre derrière la tête en gardant les bras légèrement fléchis, puis ramenez-la au-dessus de la poitrine.</p>',
    descriptionEn: '<p>Lie on a bench holding a barbell above your chest. Lower the bar behind your head keeping arms slightly bent, then bring it back above your chest.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>pull-over à la barre</strong> travaille à la fois les <strong>pectoraux</strong> et le <strong>grand dorsal</strong>. C\'est un excellent exercice pour développer la cage thoracique.</p>',
    introductionEn: '<p>The <strong>barbell pullover</strong> works both the <strong>chest</strong> and <strong>lats</strong>. It is an excellent exercise for expanding the ribcage.</p>',
    slug: "pullover-barre",
    slugEn: "barbell-pullover",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "LATS" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Développé couché à la machine",
    nameEn: "Machine Chest Press",
    description: '<p>Asseyez-vous sur la machine, saisissez les poignées à hauteur de poitrine. Poussez les poignées vers l\'avant en étendant les bras, puis revenez lentement.</p>',
    descriptionEn: '<p>Sit on the machine and grip the handles at chest height. Push the handles forward by extending your arms, then return slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>La <strong>pressé poitrine à la machine</strong> est idéale pour les débutants car elle guide le mouvement et offre une bonne stabilité pour isoler les <strong>pectoraux</strong>.</p>',
    introductionEn: '<p>The <strong>machine chest press</strong> is ideal for beginners as it guides the movement and provides stability to isolate the <strong>chest</strong>.</p>',
    slug: "presse-poitrine-machine",
    slugEn: "machine-chest-press",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "TRICEPS" },
      { attributeName: "EQUIPMENT", attributeValue: "MACHINE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  // ==================== BACK ====================
  {
    name: "Tirage poitrine à la barre",
    nameEn: "Barbell Bent-Over Row",
    description: '<p>Penché vers l\'avant avec le dos droit, tenez la barre avec une prise pronation. Tirez la barre vers le bas de la poitrine en serrant les omoplates, puis redescendez lentement.</p>',
    descriptionEn: '<p>Bend forward with a straight back holding the bar with an overhand grip. Pull the bar toward your lower chest squeezing your shoulder blades, then lower slowly.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/kNsiSsDqNnQ?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/kNsiSsDqNnQ/hqdefault.jpg",
    introduction: '<p>Le <strong>tirage poitrine à la barre</strong> est un exercice fondamental pour le <strong>dos</strong>. Il sollicite les <strong>grands dorsaux</strong>, les <strong>rhomboïdes</strong> et les <strong>trapèzes</strong>.</p>',
    introductionEn: '<p>The <strong>barbell bent-over row</strong> is a fundamental <strong>back</strong> exercise. It targets the <strong>lats</strong>, <strong>rhomboids</strong>, and <strong>traps</strong>.</p>',
    slug: "tirage-poitrine-barre",
    slugEn: "barbell-bent-over-row",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "BACK" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "BICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "LATS" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Tirage horizontal à la poulie",
    nameEn: "Cable Seated Row",
    description: '<p>Asseyez-vous face à la poulie basse, pieds sur les plaques. Saisissez la poignée, tirez vers l\'abdomen en serrant les omoplates, puis relâchez lentement.</p>',
    descriptionEn: '<p>Sit facing the low pulley with feet on the plates. Grip the handle, pull toward your abdomen squeezing your shoulder blades, then release slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>tirage horizontal à la poulie</strong> est excellent pour développer l\'épaisseur du <strong>dos</strong> en isolant les muscles rhomboïdes et les <strong>grands dorsaux</strong>.</p>',
    introductionEn: '<p>The <strong>cable seated row</strong> is excellent for developing <strong>back</strong> thickness by isolating the rhomboids and <strong>lats</strong>.</p>',
    slug: "tirage-horizontal-poulie",
    slugEn: "cable-seated-row",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "BACK" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "BICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "LATS" },
      { attributeName: "EQUIPMENT", attributeValue: "CABLE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Tirage devant avec haltère",
    nameEn: "Dumbbell One-Arm Row",
    description: '<p>Placez un genou et une main sur un banc. Tenez un haltère dans l\'autre main. Tirez l\'haltère vers la hanche en gardant le coude près du corps, puis redescendez.</p>',
    descriptionEn: '<p>Place one knee and hand on a bench. Hold a dumbbell in the other hand. Pull the dumbbell toward your hip keeping your elbow close to your body, then lower.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>tirage à un bras avec haltère</strong> permet de travailler chaque côté du <strong>dos</strong> indépendamment pour corriger les déséquilibres musculaires.</p>',
    introductionEn: '<p>The <strong>dumbbell one-arm row</strong> allows you to work each side of the <strong>back</strong> independently to correct muscle imbalances.</p>',
    slug: "tirage-haltere-un-bras",
    slugEn: "dumbbell-one-arm-row",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "BACK" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "LATS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "BICEPS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Tractions",
    nameEn: "Pull-Ups",
    description: '<p>Saisissez la barre de traction avec une prise plus large que les épaules. Tirez votre corps vers le haut jusqu\'à ce que le menton dépasse la barre, puis redescendez lentement.</p>',
    descriptionEn: '<p>Grip the pull-up bar wider than shoulder width. Pull your body up until your chin clears the bar, then lower yourself slowly.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg",
    introduction: '<p>Les <strong>tractions</strong> sont l\'un des meilleurs exercices pour le <strong>dos</strong>. Elles développent la largeur des <strong>grands dorsaux</strong> et la force du haut du corps.</p>',
    introductionEn: '<p><strong>Pull-ups</strong> are one of the best <strong>back</strong> exercises. They develop <strong>lat</strong> width and upper body strength.</p>',
    slug: "tractions",
    slugEn: "pull-ups",
    attributes: [
      { attributeName: "TYPE", attributeValue: "BODYWEIGHT" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "BACK" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "LATS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "BICEPS" },
      { attributeName: "EQUIPMENT", attributeValue: "PULLUP_BAR" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Lat pulldown à la poulie",
    nameEn: "Cable Lat Pulldown",
    description: '<p>Asseyez-vous face à la machine, saisissez la barre avec une prise plus large que les épaules. Tirez la barre vers le haut de la poitrine en contractant les dorsaux, puis relâchez lentement.</p>',
    descriptionEn: '<p>Sit facing the machine and grip the bar wider than shoulder width. Pull the bar down to your upper chest contracting your lats, then release slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>lat pulldown</strong> est excellent pour développer la largeur du <strong>dos</strong>. C\'est une alternative aux tractions pour les débutants.</p>',
    introductionEn: '<p>The <strong>cable lat pulldown</strong> is excellent for developing <strong>back</strong> width. It is an alternative to pull-ups for beginners.</p>',
    slug: "lat-pulldown-poulie",
    slugEn: "cable-lat-pulldown",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "LATS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "BICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "BACK" },
      { attributeName: "EQUIPMENT", attributeValue: "CABLE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  // ==================== SHOULDERS ====================
  {
    name: "Développé militaire à la barre",
    nameEn: "Barbell Military Press",
    description: '<p>Tenez-vous droit en tenant une barre au niveau des épaules avec une prise plus large que les épaules. Poussez la barre vers le haut au-dessus de votre tête en étendant complètement vos bras.</p>',
    descriptionEn: '<p>Stand upright holding a barbell at shoulder level with a grip wider than shoulder width. Push the barbell upward over your head by fully extending your arms.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/yJkpRER2cGk?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/yJkpRER2cGk/hqdefault.jpg",
    introduction: '<p>Le <strong>développé militaire à la barre</strong> est un exercice fondamental pour les <strong>épaules</strong>. Il sollicite également les <strong>triceps</strong> et le <strong>haut du dos</strong>.</p>',
    introductionEn: '<p>The <strong>barbell military press</strong> is a fundamental exercise for the <strong>shoulders</strong>. It also engages the <strong>triceps</strong> and <strong>upper back</strong>.</p>',
    slug: "developpe-militaire-barre",
    slugEn: "barbell-military-press",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "TRICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "TRAPS" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Développé aux haltères",
    nameEn: "Dumbbell Shoulder Press",
    description: '<p>Asseyez-vous ou tenez-vous debout avec un haltère dans chaque main au niveau des épaules. Poussez les haltères vers le haut au-dessus de la tête en étendant les bras, puis redescendez.</p>',
    descriptionEn: '<p>Sit or stand with a dumbbell in each hand at shoulder level. Push the dumbbells up above your head extending your arms, then lower back down.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>développé aux haltères</strong> permet une amplitude plus naturelle pour les <strong>épaules</strong> et travaille chaque côté indépendamment.</p>',
    introductionEn: '<p>The <strong>dumbbell shoulder press</strong> allows a more natural range of motion for the <strong>shoulders</strong> and works each side independently.</p>',
    slug: "developpe-epaules-halteres",
    slugEn: "dumbbell-shoulder-press",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "TRICEPS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Élévations latérales aux haltères",
    nameEn: "Dumbbell Lateral Raise",
    description: '<p>Tenez-vous debout avec un haltère dans chaque main le long du corps. Levez les haltères sur les côtés jusqu\'à hauteur des épaules, puis redescendez lentement.</p>',
    descriptionEn: '<p>Stand with a dumbbell in each hand at your sides. Raise the dumbbells out to the sides up to shoulder height, then lower slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Les <strong>élévations latérales</strong> sont l\'exercice d\'isolation par excellence pour les <strong>épaules</strong>, ciblant le faisceau moyen du deltoïde.</p>',
    introductionEn: '<p><strong>Lateral raises</strong> are the quintessential isolation exercise for the <strong>shoulders</strong>, targeting the middle deltoid head.</p>',
    slug: "elevations-laterales-halteres",
    slugEn: "dumbbell-lateral-raise",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Facepulls à la poulie",
    nameEn: "Cable Face Pull",
    description: '<p>Attachez une corde à la poulie haute. Tirez la corde vers votre visage en écartant les mains et en serrant les omoplettes. Revenez lentement.</p>',
    descriptionEn: '<p>Attach a rope to the high pulley. Pull the rope toward your face while spreading your hands and squeezing your shoulder blades. Return slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Les <strong>facepulls</strong> renforcent l\'arrière des <strong>épaules</strong> et les <strong>trapèzes</strong> moyens, essentiels pour une bonne posture.</p>',
    introductionEn: '<p><strong>Face pulls</strong> strengthen the rear <strong>shoulders</strong> and mid <strong>traps</strong>, essential for good posture.</p>',
    slug: "facepulls-poulie",
    slugEn: "cable-face-pull",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "TRAPS" },
      { attributeName: "EQUIPMENT", attributeValue: "CABLE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Élévations frontales aux haltères",
    nameEn: "Dumbbell Front Raise",
    description: '<p>Tenez-vous debout avec un haltère dans chaque main devant les cuisses. Levez un haltère devant vous jusqu\'à hauteur des épaules, puis redescendez et alternez.</p>',
    descriptionEn: '<p>Stand with a dumbbell in each hand in front of your thighs. Raise one dumbbell in front of you to shoulder height, then lower and alternate.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Les <strong>élévations frontales</strong> ciblent le faisceau antérieur des <strong>épaules</strong> pour un développement complet du deltoïde.</p>',
    introductionEn: '<p><strong>Front raises</strong> target the anterior head of the <strong>shoulders</strong> for complete deltoid development.</p>',
    slug: "elevations-frontales-halteres",
    slugEn: "dumbbell-front-raise",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  // ==================== BICEPS ====================
  {
    name: "Curl à la barre",
    nameEn: "Barbell Curl",
    description: '<p>Tenez-vous debout avec une barre EZ ou droite, prise supination. Fléchissez les bras pour amener la barre vers les épaules, puis redescendez lentement.</p>',
    descriptionEn: '<p>Stand holding an EZ or straight bar with an underhand grip. Flex your arms to bring the bar toward your shoulders, then lower slowly.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/kwG2ipFRsC0?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/kwG2ipFRsC0/hqdefault.jpg",
    introduction: '<p>Le <strong>curl à la barre</strong> est l\'exercice de base pour les <strong>biceps</strong>. Il permet d\'utiliser une charge plus lourde pour stimuler la croissance musculaire.</p>',
    introductionEn: '<p>The <strong>barbell curl</strong> is the basic <strong>biceps</strong> exercise. It allows heavier loading to stimulate muscle growth.</p>',
    slug: "curl-barre",
    slugEn: "barbell-curl",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "BICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "FOREARMS" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Curl alterné aux haltères",
    nameEn: "Dumbbell Alternating Curl",
    description: '<p>Tenez-vous debout avec un haltère dans chaque main. Fléchissez un bras en tournant le poignet vers l\'extérieur (supination), puis redescendez et alternez.</p>',
    descriptionEn: '<p>Stand with a dumbbell in each hand. Curl one arm while turning your wrist outward (supination), then lower and alternate.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>curl alterné aux haltères</strong> permet une contraction maximale des <strong>biceps</strong> grâce à la supination du poignet.</p>',
    introductionEn: '<p>The <strong>dumbbell alternating curl</strong> allows maximum <strong>biceps</strong> contraction through wrist supination.</p>',
    slug: "curl-alterne-halteres",
    slugEn: "dumbbell-alternating-curl",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "BICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "FOREARMS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Curl concentrate",
    nameEn: "Concentration Curl",
    description: '<p>Asseyez-vous sur un banc, penchez-vous et placez le coude contre l\'intérieur de la cuisse. Fléchissez le bras avec un haltère, puis redescendez lentement.</p>',
    descriptionEn: '<p>Sit on a bench, lean forward and place your elbow against the inside of your thigh. Curl the dumbbell up, then lower slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>curl concentration</strong> est l\'exercice d\'isolation ultime pour les <strong>biceps</strong>, éliminant toute triche.</p>',
    introductionEn: '<p>The <strong>concentration curl</strong> is the ultimate isolation exercise for the <strong>biceps</strong>, eliminating any cheating.</p>',
    slug: "curl-concentration",
    slugEn: "concentration-curl",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "BICEPS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Curl à la poulie basse",
    nameEn: "Cable Curl",
    description: '<p>Debout face à la poulie basse, saisissez la barre droite en prise supination. Fléchissez les bras pour amener la barre vers les épaules, puis redescendez lentement.</p>',
    descriptionEn: '<p>Stand facing the low pulley and grip the straight bar with an underhand grip. Curl the bar toward your shoulders, then lower slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>curl à la poulie</strong> offre une tension constante sur les <strong>biceps</strong> tout au long du mouvement.</p>',
    introductionEn: '<p>The <strong>cable curl</strong> provides constant tension on the <strong>biceps</strong> throughout the entire movement.</p>',
    slug: "curl-poulie",
    slugEn: "cable-curl",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "BICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "FOREARMS" },
      { attributeName: "EQUIPMENT", attributeValue: "CABLE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  // ==================== TRICEPS ====================
  {
    name: "Extension triceps à la barre couché",
    nameEn: "Lying Barbell Tricep Extension",
    description: '<p>Allongez-vous sur un banc, tenez une barre EZ au-dessus de la poitrine. Fléchissez les coudes pour abaisser la barre vers le front, puis étendez les bras pour revenir.</p>',
    descriptionEn: '<p>Lie on a bench holding an EZ bar above your chest. Bend your elbows to lower the bar toward your forehead, then extend your arms to return.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>L\'<strong>extension triceps couché</strong> (skull crusher) est un exercice efficace pour isoler les <strong>triceps</strong> avec une bonne amplitude.</p>',
    introductionEn: '<p>The <strong>lying tricep extension</strong> (skull crusher) is an effective exercise to isolate the <strong>triceps</strong> with a full range of motion.</p>',
    slug: "extension-triceps-couche",
    slugEn: "lying-barbell-tricep-extension",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "TRICEPS" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Extension triceps à la poulie haute",
    nameEn: "Cable Tricep Pushdown",
    description: '<p>Debout face à la poulie haute, saisissez la barre ou la corde. Poussez vers le bas en étendant les bras, puis revenez lentement à la position de départ.</p>',
    descriptionEn: '<p>Stand facing the high pulley and grip the bar or rope. Push down by extending your arms, then return slowly to the starting position.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>L\'<strong>extension triceps à la poulie</strong> est l\'un des exercices les plus populaires pour les <strong>triceps</strong>, offrant une tension constante.</p>',
    introductionEn: '<p>The <strong>cable tricep pushdown</strong> is one of the most popular <strong>triceps</strong> exercises, providing constant tension.</p>',
    slug: "extension-triceps-poulie",
    slugEn: "cable-tricep-pushdown",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "TRICEPS" },
      { attributeName: "EQUIPMENT", attributeValue: "CABLE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Extension triceps au-dessus de la tête aux haltères",
    nameEn: "Dumbbell Overhead Tricep Extension",
    description: '<p>Tenez un haltère avec les deux mains au-dessus de la tête. Fléchissez les coudes pour abaisser l\'haltère derrière la tête, puis étendez les bras pour revenir.</p>',
    descriptionEn: '<p>Hold a dumbbell with both hands above your head. Bend your elbows to lower the dumbbell behind your head, then extend your arms to return.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>L\'<strong>extension triceps au-dessus de la tête</strong> cible la longue portion du <strong>triceps</strong> pour un développement complet.</p>',
    introductionEn: '<p>The <strong>overhead tricep extension</strong> targets the long head of the <strong>triceps</strong> for complete development.</p>',
    slug: "extension-triceps-halteres",
    slugEn: "dumbbell-overhead-tricep-extension",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "TRICEPS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Dips aux parallèles",
    nameEn: "Parallel Bar Dips",
    description: '<p>Saisissez les barres parallèles, penchez-vous légèrement vers l\'avant. Descendez en fléchissant les bras jusqu\'à ce que les coudes soient à 90 degrés, puis poussez pour revenir.</p>',
    descriptionEn: '<p>Grip the parallel bars and lean slightly forward. Lower yourself by bending your arms until elbows are at 90 degrees, then push back up.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Les <strong>dips aux parallèles</strong> travaillent les <strong>triceps</strong> et le <strong>pectoral</strong> inférieur. C\'est un exercice au poids du corps très efficace.</p>',
    introductionEn: '<p><strong>Parallel bar dips</strong> work the <strong>triceps</strong> and lower <strong>chest</strong>. It is a very effective bodyweight exercise.</p>',
    slug: "dips-paralleles",
    slugEn: "parallel-bar-dips",
    attributes: [
      { attributeName: "TYPE", attributeValue: "BODYWEIGHT" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "TRICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "EQUIPMENT", attributeValue: "BODY_ONLY" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  // ==================== QUADRICEPS ====================
  {
    name: "Squat à la barre",
    nameEn: "Barbell Back Squat",
    description: '<p>Placez la barre sur les trapèzes, pieds à la largeur des épaules. Descendez en fléchissant les genoux et les hanches jusqu\'à ce que les cuisses soient parallèles au sol, puis remontez.</p>',
    descriptionEn: '<p>Place the bar on your traps with feet shoulder width apart. Descend by bending your knees and hips until thighs are parallel to the floor, then stand back up.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/bEv6CCg2BC8?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/bEv6CCg2BC8/hqdefault.jpg",
    introduction: '<p>Le <strong>squat à la barre</strong> est le roi des exercices pour les <strong>quadriceps</strong>. Il sollicite également les <strong>fessiers</strong> et les <strong>ischio-jambiers</strong>.</p>',
    introductionEn: '<p>The <strong>barbell back squat</strong> is the king of <strong>quad</strong> exercises. It also engages the <strong>glutes</strong> and <strong>hamstrings</strong>.</p>',
    slug: "squat-barre",
    slugEn: "barbell-back-squat",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "QUADRICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "HAMSTRINGS" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Squat aux haltères (Goblet Squat)",
    nameEn: "Dumbbell Goblet Squat",
    description: '<p>Tenez un haltère verticalement contre la poitrine. Descendez en squat en gardant le dos droit et les coudes entre les genoux, puis remontez.</p>',
    descriptionEn: '<p>Hold a dumbbell vertically against your chest. Squat down keeping your back straight and elbows inside your knees, then stand back up.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>goblet squat</strong> est idéal pour les débutants et travaille les <strong>quadriceps</strong> tout en améliorant la mobilité.</p>',
    introductionEn: '<p>The <strong>goblet squat</strong> is ideal for beginners and works the <strong>quads</strong> while improving mobility.</p>',
    slug: "goblet-squat-haltere",
    slugEn: "dumbbell-goblet-squat",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "QUADRICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Fentes avant aux haltères",
    nameEn: "Dumbbell Forward Lunges",
    description: '<p>Tenez un haltère dans chaque main. Faites un grand pas en avant et descendez jusqu\'à ce que les deux genoux forment un angle de 90 degrés. Repoussez-vous pour revenir.</p>',
    descriptionEn: '<p>Hold a dumbbell in each hand. Take a big step forward and lower until both knees are at 90 degrees. Push back to the starting position.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Les <strong>fentes avant aux haltères</strong> ciblent les <strong>quadriceps</strong> et les <strong>fessiers</strong> tout en améliorant l\'équilibre.</p>',
    introductionEn: '<p><strong>Dumbbell forward lunges</strong> target the <strong>quads</strong> and <strong>glutes</strong> while improving balance.</p>',
    slug: "fentes-avant-halteres",
    slugEn: "dumbbell-forward-lunges",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "QUADRICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "HAMSTRINGS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Presse à cuisses",
    nameEn: "Leg Press",
    description: '<p>Asseyez-vous dans la machine, pieds sur la plateforme à la largeur des épaules. Poussez la plateforme en étendant les jambes, puis revenez lentement.</p>',
    descriptionEn: '<p>Sit in the machine with feet on the platform shoulder width apart. Push the platform by extending your legs, then return slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>La <strong>presse à cuisses</strong> est un exercice sûr et efficace pour les <strong>quadriceps</strong> qui permet de soulever des charges importantes.</p>',
    introductionEn: '<p>The <strong>leg press</strong> is a safe and effective <strong>quad</strong> exercise that allows heavy loading.</p>',
    slug: "presse-a-cuisses",
    slugEn: "leg-press",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "QUADRICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "EQUIPMENT", attributeValue: "MACHINE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Extension des jambes à la machine",
    nameEn: "Machine Leg Extension",
    description: '<p>Asseyez-vous sur la machine, placez les chevilles sous les patins. Étendez les jambes jusqu\'à ce qu\'elles soient droites, puis redescendez lentement.</p>',
    descriptionEn: '<p>Sit on the machine and place your ankles under the pads. Extend your legs until they are straight, then lower slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>L\'<strong>extension des jambes</strong> est un exercice d\'isolation pour les <strong>quadriceps</strong>, idéal pour finaliser une séance de jambes.</p>',
    introductionEn: '<p>The <strong>leg extension</strong> is an isolation exercise for the <strong>quads</strong>, ideal for finishing a leg workout.</p>',
    slug: "extension-jambes-machine",
    slugEn: "machine-leg-extension",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "QUADRICEPS" },
      { attributeName: "EQUIPMENT", attributeValue: "MACHINE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Fentes arrières à la barre",
    nameEn: "Barbell Alternating Reverse Lunges",
    description: '<p>Tenez-vous droit en tenant une barre placée sur l\'arrière de vos épaules. Faites un pas en arrière de 2 à 3 pieds avec un pied et abaissez votre corps au sol.</p>',
    descriptionEn: '<p>Stand upright holding a barbell placed across the back of your shoulders. Step back 2-3 feet with one foot and lower your body to the ground.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/NmfQzqGktgs?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/NmfQzqGktgs/hqdefault.jpg",
    introduction: '<p>Les <strong>fentes arrières à la barre</strong> ciblent les <strong>quadriceps</strong> et les <strong>fessiers</strong>. Idéal pour améliorer l\'équilibre et la stabilité.</p>',
    introductionEn: '<p>The <strong>barbell alternating reverse lunges</strong> target the <strong>quads</strong> and <strong>glutes</strong>. Ideal for improving balance and stability.</p>',
    slug: "fentes-arrieres-barre",
    slugEn: "barbell-alternating-reverse-lunges",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "QUADRICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "HAMSTRINGS" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "EQUIPMENT", attributeValue: "BAR" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  // ==================== HAMSTRINGS ====================
  {
    name: "Soulevé de terre roumain à la barre",
    nameEn: "Barbell Romanian Deadlift",
    description: '<p>Tenez la barre en prise pronation, pieds à la largeur des épaules. Penchez-vous vers l\'avant en poussant les hanches vers l\'arrière, gardez les jambes légèrement fléchies, puis revenez.</p>',
    descriptionEn: '<p>Hold the bar with an overhand grip, feet shoulder width apart. Hinge forward pushing your hips back, keep legs slightly bent, then return to standing.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/jEy_czb3RKA?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/jEy_czb3RKA/hqdefault.jpg",
    introduction: '<p>Le <strong>soulevé de terre roumain</strong> est le meilleur exercice pour les <strong>ischio-jambiers</strong> et les <strong>fessiers</strong>. Il améliore aussi la souplesse des hanches.</p>',
    introductionEn: '<p>The <strong>Romanian deadlift</strong> is the best exercise for the <strong>hamstrings</strong> and <strong>glutes</strong>. It also improves hip flexibility.</p>',
    slug: "souleve-terre-roumain",
    slugEn: "barbell-romanian-deadlift",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "HAMSTRINGS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "BACK" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Curl ischio-jambiers à la machine",
    nameEn: "Machine Lying Leg Curl",
    description: '<p>Allongez-vous face contre terre sur la machine, placez les chevilles sous les patins. Fléchissez les jambes pour amener les talons vers les fessiers, puis redescendez lentement.</p>',
    descriptionEn: '<p>Lie face down on the machine with ankles under the pads. Curl your legs bringing your heels toward your glutes, then lower slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>curl ischio-jambiers</strong> est l\'exercice d\'isolation par excellence pour les <strong>ischio-jambiers</strong>.</p>',
    introductionEn: '<p>The <strong>lying leg curl</strong> is the quintessential isolation exercise for the <strong>hamstrings</strong>.</p>',
    slug: "curl-ischio-jambiers-machine",
    slugEn: "machine-lying-leg-curl",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "HAMSTRINGS" },
      { attributeName: "EQUIPMENT", attributeValue: "MACHINE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Soulevé de terre roumain aux haltères",
    nameEn: "Dumbbell Romanian Deadlift",
    description: '<p>Tenez un haltère dans chaque main devant les cuisses. Penchez-vous vers l\'avant en poussant les hanches vers l\'arrière, puis revenez à la position debout.</p>',
    descriptionEn: '<p>Hold a dumbbell in each hand in front of your thighs. Hinge forward pushing your hips back, then return to standing position.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>RDL aux haltères</strong> est une excellente alternative pour les <strong>ischio-jambiers</strong> si vous n\'avez pas de barre.</p>',
    introductionEn: '<p>The <strong>dumbbell RDL</strong> is a great alternative for the <strong>hamstrings</strong> if you don\'t have a barbell.</p>',
    slug: "rdl-halteres",
    slugEn: "dumbbell-romanian-deadlift",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "HAMSTRINGS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  // ==================== GLUTES ====================
  {
    name: "Hip thrust à la barre",
    nameEn: "Barbell Hip Thrust",
    description: '<p>Asseyez-vous au sol, le haut du dos contre un banc. Placez la barre sur les hanches. Poussez les hanches vers le haut en contractant les fessiers, puis redescendez.</p>',
    descriptionEn: '<p>Sit on the floor with your upper back against a bench. Place the barbell on your hips. Drive your hips up by squeezing your glutes, then lower.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/7aYmhU7MrWI?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/7aYmhU7MrWI/hqdefault.jpg",
    introduction: '<p>Le <strong>hip thrust à la barre</strong> est le meilleur exercice pour isoler et développer les <strong>fessiers</strong>.</p>',
    introductionEn: '<p>The <strong>barbell hip thrust</strong> is the best exercise to isolate and develop the <strong>glutes</strong>.</p>',
    slug: "hip-thrust-barre",
    slugEn: "barbell-hip-thrust",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "HAMSTRINGS" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Hip thrust aux haltères",
    nameEn: "Dumbbell Hip Thrust",
    description: '<p>Asseyez-vous au sol, le haut du dos contre un banc. Placez un haltère sur les hanches. Poussez les hanches vers le haut en contractant les fessiers, puis redescendez.</p>',
    descriptionEn: '<p>Sit on the floor with your upper back against a bench. Place a dumbbell on your hips. Drive your hips up by squeezing your glutes, then lower.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>hip thrust aux haltères</strong> est une alternative accessible pour cibler les <strong>fessiers</strong> sans barre.</p>',
    introductionEn: '<p>The <strong>dumbbell hip thrust</strong> is an accessible alternative to target the <strong>glutes</strong> without a barbell.</p>',
    slug: "hip-thrust-haltere",
    slugEn: "dumbbell-hip-thrust",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "HAMSTRINGS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Pont fessier au poids du corps",
    nameEn: "Bodyweight Glute Bridge",
    description: '<p>Allongez-vous sur le dos, genoux fléchis, pieds au sol. Poussez les hanches vers le haut en contractant les fessiers, puis redescendez.</p>',
    descriptionEn: '<p>Lie on your back with knees bent and feet on the floor. Drive your hips up by squeezing your glutes, then lower back down.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>pont fessier</strong> est un exercice au poids du corps pour activer et renforcer les <strong>fessiers</strong>.</p>',
    introductionEn: '<p>The <strong>glute bridge</strong> is a bodyweight exercise to activate and strengthen the <strong>glutes</strong>.</p>',
    slug: "pont-fessier",
    slugEn: "bodyweight-glute-bridge",
    attributes: [
      { attributeName: "TYPE", attributeValue: "BODYWEIGHT" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "HAMSTRINGS" },
      { attributeName: "EQUIPMENT", attributeValue: "BODY_ONLY" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  // ==================== ABDOMINALS ====================
  {
    name: "Crunchs",
    nameEn: "Crunches",
    description: '<p>Allongez-vous sur le dos, genoux fléchis, mains derrière la tête. Soulevez les épaules du sol en contractant les abdominaux, puis redescendez.</p>',
    descriptionEn: '<p>Lie on your back with knees bent and hands behind your head. Lift your shoulders off the floor by contracting your abs, then lower back down.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Les <strong>crunchs</strong> sont un exercice classique pour les <strong>abdominaux</strong>, ciblant le grand droit de l\'abdomen.</p>',
    introductionEn: '<p><strong>Crunches</strong> are a classic <strong>abdominal</strong> exercise targeting the rectus abdominis.</p>',
    slug: "crunchs",
    slugEn: "crunches",
    attributes: [
      { attributeName: "TYPE", attributeValue: "BODYWEIGHT" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "ABDOMINALS" },
      { attributeName: "EQUIPMENT", attributeValue: "BODY_ONLY" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Planche",
    nameEn: "Plank",
    description: '<p>Placez vos avant-bras au sol, les coudes sous les épaules. Levez le corps en vous appuyant sur les pointes de pieds. Maintenez la position en gardant le corps aligné.</p>',
    descriptionEn: '<p>Place your forearms on the floor with elbows under your shoulders. Lift your body resting on your toes. Hold the position keeping your body aligned.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>La <strong>planche</strong> est un exercice d\'endurance pour les <strong>abdominaux</strong> qui renforce aussi le transverse.</p>',
    introductionEn: '<p>The <strong>plank</strong> is an endurance exercise for the <strong>abdominals</strong> that also strengthens the transverse abdominis.</p>',
    slug: "planche",
    slugEn: "plank",
    attributes: [
      { attributeName: "TYPE", attributeValue: "BODYWEIGHT" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "ABDOMINALS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "EQUIPMENT", attributeValue: "BODY_ONLY" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Relevé de jambes suspendu",
    nameEn: "Hanging Leg Raise",
    description: '<p>Suspendez-vous à une barre de traction. Levez les jambes tendues jusqu\'à ce qu\'elles soient parallèles au sol, puis redescendez lentement.</p>',
    descriptionEn: '<p>Hang from a pull-up bar. Raise your straight legs until they are parallel to the floor, then lower slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>relevé de jambes suspendu</strong> est un exercice avancé pour les <strong>abdominaux</strong> inférieurs.</p>',
    introductionEn: '<p>The <strong>hanging leg raise</strong> is an advanced exercise for the lower <strong>abdominals</strong>.</p>',
    slug: "releve-jambes-suspendu",
    slugEn: "hanging-leg-raise",
    attributes: [
      { attributeName: "TYPE", attributeValue: "BODYWEIGHT" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "ABDOMINALS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "HIP_FLEXOR" },
      { attributeName: "EQUIPMENT", attributeValue: "PULLUP_BAR" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Russian twist aux haltères",
    nameEn: "Dumbbell Russian Twist",
    description: '<p>Asseyez-vous au sol, genoux fléchis, penchez-vous légèrement en arrière. Tenez un haltère devant vous et tournez le buste de gauche à droite.</p>',
    descriptionEn: '<p>Sit on the floor with knees bent and lean back slightly. Hold a dumbbell in front of you and twist your torso from left to right.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>Russian twist</strong> cible les <strong>obliques</strong> et les <strong>abdominaux</strong> avec un mouvement de rotation.</p>',
    introductionEn: '<p>The <strong>Russian twist</strong> targets the <strong>obliques</strong> and <strong>abdominals</strong> with a rotational movement.</p>',
    slug: "russian-twist-haltere",
    slugEn: "dumbbell-russian-twist",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "ABDOMINALS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "OBLIQUES" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  // ==================== CALVES ====================
  {
    name: "Mollets debout à la machine",
    nameEn: "Machine Standing Calf Raise",
    description: '<p>Placez-vous sur la machine, les épaules sous les coussinets. Levez-vous sur la pointe des pieds en contractant les mollets, puis redescendez lentement.</p>',
    descriptionEn: '<p>Stand on the machine with shoulders under the pads. Rise up on your toes by contracting your calves, then lower slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>mollet debout</strong> cible le gastrocnémien pour développer les <strong>mollets</strong>.</p>',
    introductionEn: '<p>The <strong>standing calf raise</strong> targets the gastrocnemius to develop the <strong>calves</strong>.</p>',
    slug: "mollets-debout-machine",
    slugEn: "machine-standing-calf-raise",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "CALVES" },
      { attributeName: "EQUIPMENT", attributeValue: "MACHINE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Mollets debout aux haltères",
    nameEn: "Dumbbell Standing Calf Raise",
    description: '<p>Tenez un haltère dans chaque main. Levez-vous sur la pointe des pieds en contractant les mollets, puis redescendez lentement.</p>',
    descriptionEn: '<p>Hold a dumbbell in each hand. Rise up on your toes by contracting your calves, then lower slowly.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Les <strong>mollets debout aux haltères</strong> sont une alternative simple pour renforcer les <strong>mollets</strong> sans machine.</p>',
    introductionEn: '<p><strong>Dumbbell standing calf raises</strong> are a simple alternative to strengthen the <strong>calves</strong> without a machine.</p>',
    slug: "mollets-debout-halteres",
    slugEn: "dumbbell-standing-calf-raise",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "CALVES" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  // ==================== FOREARMS ====================
  {
    name: "Curl poignet à la barre",
    nameEn: "Barbell Wrist Curl",
    description: '<p>Asseyez-vous, avant-bras sur les cuisses, barre en prise supination. Fléchissez les poignets pour lever la barre, puis redescendez.</p>',
    descriptionEn: '<p>Sit with forearms on your thighs holding a bar with underhand grip. Flex your wrists to raise the bar, then lower.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>curl poignet</strong> renforce les <strong>avant-bras</strong> et améliore la force de préhension.</p>',
    introductionEn: '<p>The <strong>wrist curl</strong> strengthens the <strong>forearms</strong> and improves grip strength.</p>',
    slug: "curl-poignet-barre",
    slugEn: "barbell-wrist-curl",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "FOREARMS" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  // ==================== TRAPS ====================
  {
    name: "Shrugs aux haltères",
    nameEn: "Dumbbell Shrugs",
    description: '<p>Tenez un haltère dans chaque main le long du corps. Haussez les épaules le plus haut possible en contractant les trapèzes, puis relâchez.</p>',
    descriptionEn: '<p>Hold a dumbbell in each hand at your sides. Shrug your shoulders as high as possible contracting your traps, then release.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Les <strong>shrugs aux haltères</strong> sont l\'exercice de base pour les <strong>trapèzes</strong> supérieurs.</p>',
    introductionEn: '<p><strong>Dumbbell shrugs</strong> are the basic exercise for the upper <strong>traps</strong>.</p>',
    slug: "shrugs-halteres",
    slugEn: "dumbbell-shrugs",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "TRAPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  {
    name: "Shrugs à la barre",
    nameEn: "Barbell Shrugs",
    description: '<p>Tenez la barre en prise pronation devant les cuisses. Haussez les épaules le plus haut possible, puis relâchez.</p>',
    descriptionEn: '<p>Hold the bar with an overhand grip in front of your thighs. Shrug your shoulders as high as possible, then release.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Les <strong>shrugs à la barre</strong> permettent d\'utiliser des charges plus lourdes pour les <strong>trapèzes</strong>.</p>',
    introductionEn: '<p><strong>Barbell shrugs</strong> allow heavier loading for the <strong>traps</strong>.</p>',
    slug: "shrugs-barre",
    slugEn: "barbell-shrugs",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "TRAPS" },
      { attributeName: "EQUIPMENT", attributeValue: "BARBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  // ==================== LATS ====================
  {
    name: "Pullover aux haltères",
    nameEn: "Dumbbell Pullover",
    description: '<p>Allongez-vous sur un banc, tenez un haltère au-dessus de la poitrine. Abaissez l\'haltère derrière la tête en gardant les bras légèrement fléchis, puis ramenez-le au-dessus de la poitrine.</p>',
    descriptionEn: '<p>Lie on a bench holding a dumbbell above your chest. Lower the dumbbell behind your head keeping arms slightly bent, then bring it back above your chest.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>pullover aux haltères</strong> travaille les <strong>grands dorsaux</strong> et les <strong>pectoraux</strong> en même temps.</p>',
    introductionEn: '<p>The <strong>dumbbell pullover</strong> works the <strong>lats</strong> and <strong>chest</strong> simultaneously.</p>',
    slug: "pullover-haltere",
    slugEn: "dumbbell-pullover",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "LATS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "EQUIPMENT", attributeValue: "DUMBBELL" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  // ==================== FULL BODY / CARDIO ====================
  {
    name: "Burpees",
    nameEn: "Burpees",
    description: '<p>Debout, descendez en squat, posez les mains au sol, jetez les pieds en arrière en position de planche. Faites une pompe, ramenez les pieds en squat, puis sautez en levant les bras.</p>',
    descriptionEn: '<p>From standing, squat down, place hands on floor, kick feet back to plank. Do a push-up, hop feet back to squat, then jump up raising your arms.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Les <strong>burpees</strong> sont un exercice complet au <strong>poids du corps</strong> qui combine force et cardio.</p>',
    introductionEn: '<p><strong>Burpees</strong> are a full <strong>bodyweight</strong> exercise combining strength and cardio.</p>',
    slug: "burpees",
    slugEn: "burpees",
    attributes: [
      { attributeName: "TYPE", attributeValue: "CARDIO" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "FULL_BODY" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "ABDOMINALS" },
      { attributeName: "EQUIPMENT", attributeValue: "BODY_ONLY" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  {
    name: "Kettlebell Swing",
    nameEn: "Kettlebell Swing",
    description: '<p>Tenez le kettlebell avec les deux mains. Balancez-le entre vos jambes en poussant les hanches vers l\'arrière, puis projetez-le vers l\'avant en étendant les hanches avec force.</p>',
    descriptionEn: '<p>Hold the kettlebell with both hands. Swing it between your legs pushing hips back, then drive it forward by extending your hips forcefully.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>kettlebell swing</strong> développe la puissance des <strong>fessiers</strong> et des <strong>ischio-jambiers</strong> tout en améliorant le cardio.</p>',
    introductionEn: '<p>The <strong>kettlebell swing</strong> develops <strong>glute</strong> and <strong>hamstring</strong> power while improving cardio.</p>',
    slug: "kettlebell-swing",
    slugEn: "kettlebell-swing",
    attributes: [
      { attributeName: "TYPE", attributeValue: "POWER" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "HAMSTRINGS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "BACK" },
      { attributeName: "EQUIPMENT", attributeValue: "KETTLEBELLS" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
  // ==================== CABLE CHEST (original) ====================
  {
    name: "Tirage poitrine à la poulie",
    nameEn: "Cable Chest Fly",
    description: '<p>Placez les poulies en position haute et tenez une poignée dans chaque main. Avancez d\'un pas entre les poulies et penchez-vous légèrement vers l\'avant. Amenez vos mains ensemble devant vous en gardant les bras légèrement pliés.</p>',
    descriptionEn: '<p>Set the pulleys to the high position and hold a handle in each hand. Step forward between the pulleys and lean slightly forward. Bring your hands together in front of you while keeping your arms slightly bent.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/eZU9Ss1Jc0E?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/eZU9Ss1Jc0E/hqdefault.jpg",
    introduction: '<p>Le <strong>tirage poitrine à la poulie</strong> est un exercice d\'isolation efficace pour les <strong>pectoraux</strong> avec une tension constante.</p>',
    introductionEn: '<p>The <strong>cable chest fly</strong> is an effective isolation exercise for the <strong>chest</strong> with constant tension.</p>',
    slug: "tirage-poitrine-poulie",
    slugEn: "cable-chest-fly",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "CHEST" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "SHOULDERS" },
      { attributeName: "EQUIPMENT", attributeValue: "CABLE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "ISOLATION" },
    ],
  },
  // ==================== SMITH MACHINE ====================
  {
    name: "Squat à la machine Smith",
    nameEn: "Smith Machine Squat",
    description: '<p>Placez la barre de la machine Smith sur vos trapèzes. Descendez en squat en fléchissant les genoux jusqu\'à ce que les cuisses soient parallèles au sol, puis remontez.</p>',
    descriptionEn: '<p>Place the Smith machine bar on your traps. Squat down by bending your knees until thighs are parallel to the floor, then stand back up.</p>',
    fullVideoUrl: null,
    fullVideoImageUrl: null,
    introduction: '<p>Le <strong>squat à la Smith</strong> offre plus de stabilité pour les <strong>quadriceps</strong>, idéal pour les débutants ou la rééducation.</p>',
    introductionEn: '<p>The <strong>Smith machine squat</strong> provides more stability for the <strong>quads</strong>, ideal for beginners or rehabilitation.</p>',
    slug: "squat-smith",
    slugEn: "smith-machine-squat",
    attributes: [
      { attributeName: "TYPE", attributeValue: "STRENGTH" },
      { attributeName: "PRIMARY_MUSCLE", attributeValue: "QUADRICEPS" },
      { attributeName: "SECONDARY_MUSCLE", attributeValue: "GLUTES" },
      { attributeName: "EQUIPMENT", attributeValue: "SMITH_MACHINE" },
      { attributeName: "MECHANICS_TYPE", attributeValue: "COMPOUND" },
    ],
  },
];

// =============================================
// SEED LOGIC
// =============================================
function normalizeAttributeValue(value: string): ExerciseAttributeValueEnum {
  const cleaned = value.trim().toUpperCase();
  if (["N/A", "NA", "NONE", "NULL", ""].includes(cleaned)) return "NA" as ExerciseAttributeValueEnum;
  if ((Object.values(ExerciseAttributeValueEnum) as string[]).includes(cleaned)) {
    return cleaned as ExerciseAttributeValueEnum;
  }
  throw new Error(`Unknown attribute value: ${value}`);
}

export async function GET(request: Request) {
  const logs: string[] = [];
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  try {
    // Check if already seeded
    const existingAttributeNames = await prisma.exerciseAttributeName.count();
    const existingExercises = await prisma.exercise.count();

    if (existingAttributeNames > 0 && existingExercises > 0 && !force) {
      return NextResponse.json({
        status: "already_seeded",
        message: "Database already has data. Use ?force=true to re-seed.",
        attributeNames: existingAttributeNames,
        exercises: existingExercises,
      });
    }

    // If force=true, clean up existing exercises first
    if (force && existingExercises > 0) {
      logs.push("Force mode: cleaning existing exercise data...");
      await prisma.exerciseAttribute.deleteMany({});
      await prisma.exercise.deleteMany({});
      logs.push("Cleared existing exercises and attributes");
    }

    // Step 1: Seed attribute taxonomy
    logs.push("Step 1: Seeding attribute taxonomy...");
    for (const [name, values] of Object.entries(attributeMap)) {
      const attributeName = await prisma.exerciseAttributeName.upsert({
        where: { name: name as ExerciseAttributeNameEnum },
        update: {},
        create: { name: name as ExerciseAttributeNameEnum },
      });

      logs.push(`  Created attribute name: ${name} (${attributeName.id})`);

      for (const value of values) {
        await prisma.exerciseAttributeValue.upsert({
          where: {
            attributeNameId_value: {
              attributeNameId: attributeName.id,
              value: value as ExerciseAttributeValueEnum,
            },
          },
          update: {},
          create: {
            attributeNameId: attributeName.id,
            value: value as ExerciseAttributeValueEnum,
          },
        });
      }

      logs.push(`  Added ${values.length} values for ${name}`);
    }

    const nameCount = await prisma.exerciseAttributeName.count();
    const valueCount = await prisma.exerciseAttributeValue.count();
    logs.push(`Attribute taxonomy: ${nameCount} names, ${valueCount} values`);

    // Step 2: Seed sample exercises
    logs.push("\nStep 2: Seeding exercises...");
    let imported = 0;
    let errors = 0;

    for (const exercise of sampleExercises) {
      try {
        const createdExercise = await prisma.exercise.upsert({
          where: { slug: exercise.slug },
          update: {
            name: exercise.name,
            nameEn: exercise.nameEn,
            description: exercise.description,
            descriptionEn: exercise.descriptionEn,
            fullVideoUrl: exercise.fullVideoUrl,
            fullVideoImageUrl: exercise.fullVideoImageUrl,
            introduction: exercise.introduction,
            introductionEn: exercise.introductionEn,
            slugEn: exercise.slugEn,
          },
          create: {
            name: exercise.name,
            nameEn: exercise.nameEn,
            description: exercise.description,
            descriptionEn: exercise.descriptionEn,
            fullVideoUrl: exercise.fullVideoUrl,
            fullVideoImageUrl: exercise.fullVideoImageUrl,
            introduction: exercise.introduction,
            introductionEn: exercise.introductionEn,
            slug: exercise.slug,
            slugEn: exercise.slugEn,
          },
        });

        // Remove old attributes
        await prisma.exerciseAttribute.deleteMany({
          where: { exerciseId: createdExercise.id },
        });

        // Create new attributes
        for (const attr of exercise.attributes) {
          try {
            const attributeName = await prisma.exerciseAttributeName.findUnique({
              where: { name: attr.attributeName as ExerciseAttributeNameEnum },
            });

            if (!attributeName) {
              logs.push(`  WARNING: Attribute name ${attr.attributeName} not found, skipping`);
              continue;
            }

            const normalizedValue = normalizeAttributeValue(attr.attributeValue);

            const attributeValue = await prisma.exerciseAttributeValue.findFirst({
              where: {
                attributeNameId: attributeName.id,
                value: normalizedValue,
              },
            });

            if (!attributeValue) {
              logs.push(`  WARNING: Attribute value ${attr.attributeValue} not found, skipping`);
              continue;
            }

            await prisma.exerciseAttribute.create({
              data: {
                exerciseId: createdExercise.id,
                attributeNameId: attributeName.id,
                attributeValueId: attributeValue.id,
              },
            });
          } catch (attrError) {
            logs.push(`  Attribute error: ${attrError}`);
          }
        }

        logs.push(`  Imported: ${exercise.nameEn}`);
        imported++;
      } catch (error) {
        logs.push(`  Error importing ${exercise.nameEn}: ${error}`);
        errors++;
      }
    }

    // Step 3: Final summary
    const totalExercises = await prisma.exercise.count();
    const totalAttributes = await prisma.exerciseAttribute.count();

    logs.push(`\nSeed complete!`);
    logs.push(`  Exercises: ${totalExercises}`);
    logs.push(`  Exercise Attributes: ${totalAttributes}`);
    logs.push(`  Imported: ${imported}, Errors: ${errors}`);

    return NextResponse.json({
      status: "success",
      message: "Database seeded successfully!",
      summary: {
        attributeNames: nameCount,
        attributeValues: valueCount,
        exercises: totalExercises,
        exerciseAttributes: totalAttributes,
      },
      logs,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        logs,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
