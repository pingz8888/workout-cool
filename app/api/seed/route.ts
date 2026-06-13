import { NextResponse } from "next/server";
import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum, PrismaClient } from "@prisma/client";
import { csvExercises } from "../../../scripts/csv-exercises-data";

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
// EXERCISE TEMPLATE SYSTEM
// =============================================
type Muscle = string;
type Equip = string;
type MechType = "COMPOUND" | "ISOLATION";
type ExerciseType = string;

interface ExerciseTemplate {
  nameEn: string;
  nameFr: string;
  primaryMuscle: Muscle;
  secondaryMuscles?: Muscle[];
  equipment: Equip[];
  mechanicsType: MechType;
  exerciseType: ExerciseType;
  descriptionEn: string;
  descriptionFr: string;
  introEn: string;
  introFr: string;
}

// Helper to generate a slug from a name
function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Helper to generate French slug
function toSlugFr(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9àâçéèêëîïôùûüÿñæœ]+/g, "-")
    .replace(/^-|-$/g, "");
}

// =============================================
// COMPREHENSIVE EXERCISE TEMPLATES
// Each template can generate multiple exercises when
// multiple equipment types are listed
// =============================================
const exerciseTemplates: ExerciseTemplate[] = [
  // ==================== CHEST ====================
  { nameEn: "Bench Press", nameFr: "Développé couché", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS", "SHOULDERS"], equipment: ["BARBELL", "DUMBBELL", "MACHINE", "SMITH_MACHINE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Lie on a flat bench and press the weight upward from chest level until arms are fully extended.", descriptionFr: "Allongé sur un banc plat, pressez le poids vers le haut depuis la poitrine jusqu'à extension complète des bras.", introEn: "The bench press is the fundamental chest exercise for building strength and mass.", introFr: "Le développé couché est l'exercice fondamental pour la force et la masse de la poitrine." },
  { nameEn: "Incline Press", nameFr: "Développé incliné", primaryMuscle: "CHEST", secondaryMuscles: ["SHOULDERS", "TRICEPS"], equipment: ["BARBELL", "DUMBBELL", "MACHINE", "SMITH_MACHINE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Lie on an incline bench set at 30-45 degrees and press the weight upward from the upper chest.", descriptionFr: "Allongé sur un banc incliné à 30-45 degrés, pressez le poids vers le haut depuis le haut de la poitrine.", introEn: "The incline press targets the upper chest for complete pectoral development.", introFr: "Le développé incliné cible le haut des pectoraux pour un développement complet." },
  { nameEn: "Decline Press", nameFr: "Développé décliné", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS"], equipment: ["BARBELL", "DUMBBELL", "MACHINE", "SMITH_MACHINE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Lie on a decline bench and press the weight upward from the lower chest.", descriptionFr: "Allongé sur un banc décliné, pressez le poids vers le haut depuis le bas de la poitrine.", introEn: "The decline press emphasizes the lower chest muscles.", introFr: "Le développé décliné sollicite davantage la partie inférieure des pectoraux." },
  { nameEn: "Chest Fly", nameFr: "Écarté poitrine", primaryMuscle: "CHEST", secondaryMuscles: ["SHOULDERS"], equipment: ["DUMBBELL", "CABLE", "MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "With arms slightly bent, open them wide and then bring them together in a hugging motion.", descriptionFr: "Bras légèrement fléchis, ouvrez-les largement puis ramenez-les ensemble dans un mouvement d'étreinte.", introEn: "Chest flyes isolate the pectoral muscles through a deep stretch and contraction.", introFr: "Les écartés isolent les pectoraux grâce à un étirement et une contraction profonds." },
  { nameEn: "Cable Crossover", nameFr: "Croisé câbles", primaryMuscle: "CHEST", secondaryMuscles: ["SHOULDERS"], equipment: ["CABLE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Stand between two high pulleys and bring your arms together in a crossing motion in front of your chest.", descriptionFr: "Debout entre deux poulies hautes, ramenez vos bras ensemble dans un mouvement de croisement devant la poitrine.", introEn: "Cable crossovers provide constant tension throughout the chest's full range of motion.", introFr: "Les croisés câbles offrent une tension constante sur toute l'amplitude du mouvement." },
  { nameEn: "Push-Up", nameFr: "Pompe", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS", "SHOULDERS"], equipment: ["BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "In a plank position, lower your body by bending your arms until your chest nearly touches the floor, then push back up.", descriptionFr: "En position de planche, descendez en fléchissant les bras jusqu'à ce que la poitrine frôle le sol, puis remontez.", introEn: "Push-ups are a classic bodyweight exercise that builds chest, triceps, and shoulder strength.", introFr: "Les pompes sont un exercice classique au poids du corps pour les pectoraux, triceps et épaules." },
  { nameEn: "Wide Push-Up", nameFr: "Pompe large", primaryMuscle: "CHEST", secondaryMuscles: ["SHOULDERS"], equipment: ["BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Perform a push-up with hands placed wider than shoulder width to emphasize the chest.", descriptionFr: "Effectuez une pompe avec les mains plus écartées que la largeur des épaules pour solliciter les pectoraux.", introEn: "Wide push-ups shift more emphasis onto the chest muscles.", introFr: "Les pompes larges déplacent l'accent sur les muscles pectoraux." },
  { nameEn: "Diamond Push-Up", nameFr: "Pompe diamant", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS"], equipment: ["BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Perform a push-up with hands close together forming a diamond shape to target the inner chest and triceps.", descriptionFr: "Effectuez une pompe avec les mains rapprochées formant un diamant pour cibler la partie interne des pectoraux.", introEn: "Diamond push-ups intensely target the inner chest and triceps.", introFr: "Les pompes diamant ciblent intensément la partie interne des pectoraux et les triceps." },
  { nameEn: "Decline Push-Up", nameFr: "Pompe déclinée", primaryMuscle: "CHEST", secondaryMuscles: ["SHOULDERS", "TRICEPS"], equipment: ["BODY_ONLY", "BENCH"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Place your feet on a bench and perform a push-up to target the upper chest.", descriptionFr: "Placez vos pieds sur un banc et effectuez une pompe pour cibler le haut des pectoraux.", introEn: "Decline push-ups shift emphasis to the upper chest.", introFr: "Les pompes déclinées ciblent le haut des pectoraux." },
  { nameEn: "Incline Push-Up", nameFr: "Pompe inclinée", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS"], equipment: ["BODY_ONLY", "BENCH"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Place your hands on a bench and perform a push-up for an easier variation targeting the lower chest.", descriptionFr: "Placez vos mains sur un banc et effectuez une pompe pour une variante plus facile ciblant le bas des pectoraux.", introEn: "Incline push-ups are a beginner-friendly variation targeting the lower chest.", introFr: "Les pompes inclinées sont une variante accessible pour les débutants ciblant le bas des pectoraux." },
  { nameEn: "Pullover", nameFr: "Pull-over", primaryMuscle: "CHEST", secondaryMuscles: ["LATS", "TRICEPS"], equipment: ["BARBELL", "DUMBBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Lie on a bench and lower a weight behind your head with arms slightly bent, then pull it back over your chest.", descriptionFr: "Allongé sur un banc, abaissez un poids derrière la tête bras légèrement fléchis, puis ramenez-le au-dessus de la poitrine.", introEn: "Pullovers work both the chest and lats through a deep stretch.", introFr: "Les pull-overs travaillent les pectoraux et les dorsaux grâce à un étirement profond." },
  { nameEn: "Dip (Chest)", nameFr: "Dips poitrine", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS", "SHOULDERS"], equipment: ["BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "On parallel bars, lean forward slightly and lower your body by bending your arms, then push back up.", descriptionFr: "Aux barres parallèles, penchez-vous légèrement en avant et descendez en fléchissant les bras, puis remontez.", introEn: "Chest-focused dips are excellent for building the lower and outer chest.", introFr: "Les dips poitrine sont excellents pour développer la partie inférieure et externe des pectoraux." },
  { nameEn: "Squeeze Press", nameFr: "Press serré", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS"], equipment: ["DUMBBELL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Lie on a bench pressing two dumbbells together while squeezing them against each other throughout the movement.", descriptionFr: "Allongé sur un banc, pressez deux haltères l'un contre l'autre tout au long du mouvement.", introEn: "The squeeze press maximizes inner chest activation by keeping constant tension.", introFr: "Le press serré maximise l'activation de la partie interne des pectoraux." },
  { nameEn: "Floor Press", nameFr: "Développé au sol", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS"], equipment: ["BARBELL", "DUMBBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Lie on the floor and press the weight up from chest level. Your elbows touch the floor at the bottom.", descriptionFr: "Allongé au sol, pressez le poids vers le haut. Les coudes touchent le sol en position basse.", introEn: "The floor press is great for building lockout strength and reducing shoulder strain.", introFr: "Le développé au sol est excellent pour la force de verrouillage et réduit la tension sur les épaules." },
  { nameEn: "Machine Chest Fly", nameFr: "Écarté machine", primaryMuscle: "CHEST", secondaryMuscles: ["SHOULDERS"], equipment: ["MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Sit in the pec deck machine and bring your arms together in front of your chest.", descriptionFr: "Asseyez-vous dans la machine pec deck et ramenez vos bras ensemble devant la poitrine.", introEn: "The machine chest fly provides a guided, safe way to isolate the chest muscles.", introFr: "L'écarté machine offre un mouvement guidé et sûr pour isoler les pectoraux." },

  // ==================== BACK ====================
  { nameEn: "Bent-Over Row", nameFr: "Tirage buste penché", primaryMuscle: "BACK", secondaryMuscles: ["LATS", "BICEPS"], equipment: ["BARBELL", "DUMBBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Bend at the hips keeping your back flat and row the weight toward your lower chest.", descriptionFr: "Penchez-vous en gardant le dos plat et tirez le poids vers le bas de la poitrine.", introEn: "Bent-over rows are a fundamental back exercise for thickness and strength.", introFr: "Le tirage buste penché est un exercice fondamental pour l'épaisseur et la force du dos." },
  { nameEn: "Seated Row", nameFr: "Tirage horizontal", primaryMuscle: "BACK", secondaryMuscles: ["LATS", "BICEPS"], equipment: ["CABLE", "MACHINE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Sit at a cable or machine and pull the handle toward your abdomen squeezing your shoulder blades.", descriptionFr: "Asseyez-vous à la poulie ou à la machine et tirez la poignée vers l'abdomen en serrant les omoplates.", introEn: "Seated rows develop back thickness and target the mid-back muscles.", introFr: "Le tirage horizontal développe l'épaisseur du dos et cible les muscles du milieu du dos." },
  { nameEn: "One-Arm Row", nameFr: "Tirage à un bras", primaryMuscle: "BACK", secondaryMuscles: ["LATS", "BICEPS"], equipment: ["DUMBBELL", "CABLE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "With one hand and knee on a bench, row the weight up to your hip keeping your elbow close to your body.", descriptionFr: "Une main et un genou sur un banc, tirez le poids vers la hanche en gardant le coude près du corps.", introEn: "One-arm rows allow you to focus on each side independently for balanced development.", introFr: "Le tirage à un bras permet de travailler chaque côté indépendamment." },
  { nameEn: "Pull-Up", nameFr: "Traction", primaryMuscle: "BACK", secondaryMuscles: ["LATS", "BICEPS"], equipment: ["PULLUP_BAR"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Hang from a bar and pull your body up until your chin clears the bar.", descriptionFr: "Suspendu à une barre, tirez votre corps vers le haut jusqu'à ce que le menton dépasse la barre.", introEn: "Pull-ups are the gold standard for back width and overall upper body strength.", introFr: "Les tractions sont la référence pour la largeur du dos et la force du haut du corps." },
  { nameEn: "Chin-Up", nameFr: "Traction supination", primaryMuscle: "BACK", secondaryMuscles: ["BICEPS", "LATS"], equipment: ["PULLUP_BAR"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Hang from a bar with an underhand grip and pull your body up until your chin clears the bar.", descriptionFr: "Suspendu à une barre en prise supination, tirez votre corps vers le haut.", introEn: "Chin-ups emphasize the biceps more than pull-ups while still targeting the back.", introFr: "Les tractions supination sollicitent davantage les biceps tout en ciblant le dos." },
  { nameEn: "Lat Pulldown", nameFr: "Tirage vertical", primaryMuscle: "LATS", secondaryMuscles: ["BICEPS", "BACK"], equipment: ["CABLE", "MACHINE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Sit at the lat pulldown machine and pull the bar down to your upper chest.", descriptionFr: "Asseyez-vous à la machine et tirez la barre vers le haut de la poitrine.", introEn: "Lat pulldowns are the best alternative to pull-ups for building back width.", introFr: "Le tirage vertical est la meilleure alternative aux tractions pour la largeur du dos." },
  { nameEn: "Deadlift", nameFr: "Soulevé de terre", primaryMuscle: "BACK", secondaryMuscles: ["GLUTES", "HAMSTRINGS", "TRAPS"], equipment: ["BARBELL"], mechanicsType: "COMPOUND", exerciseType: "POWERLIFTING", descriptionEn: "With the bar on the floor, grip it and stand up straight by extending your hips and knees simultaneously.", descriptionFr: "La barre au sol, saisissez-la et levez-vous en étendant les hanches et les genoux simultanément.", introEn: "The deadlift is the king of all strength exercises, working the entire posterior chain.", introFr: "Le soulevé de terre est le roi des exercices de force, travaillant toute la chaîne postérieure." },
  { nameEn: "T-Bar Row", nameFr: "Tirage T-Bar", primaryMuscle: "BACK", secondaryMuscles: ["LATS", "BICEPS"], equipment: ["BARBELL", "MACHINE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Straddle a barbell loaded on one end and row the weight toward your chest.", descriptionFr: "Enjambez une barre chargée d'un côté et tirez le poids vers la poitrine.", introEn: "T-bar rows allow heavy loading for back thickness development.", introFr: "Le tirage T-Bar permet des charges lourdes pour le développement de l'épaisseur du dos." },
  { nameEn: "Straight-Arm Pulldown", nameFr: "Tirage vertical bras tendus", primaryMuscle: "LATS", secondaryMuscles: ["BACK", "TRICEPS"], equipment: ["CABLE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Stand at a high cable and pull the bar down to your thighs keeping your arms straight.", descriptionFr: "Debout à la poulie haute, tirez la barre vers les cuisses en gardant les bras tendus.", introEn: "Straight-arm pulldowns isolate the lats without bicep involvement.", introFr: "Le tirage vertical bras tendus isole les dorsaux sans implication des biceps." },
  { nameEn: "Meadows Row", nameFr: "Tirage Meadows", primaryMuscle: "BACK", secondaryMuscles: ["LATS", "BICEPS"], equipment: ["BARBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Using a landmine attachment, row the bar from one end with a pronated grip.", descriptionFr: "En utilisant un landmine, tirez la barre d'un côté avec une prise pronation.", introEn: "Meadows rows provide a unique angle for back development.", introFr: "Le tirage Meadows offre un angle unique pour le développement du dos." },
  { nameEn: "Renegade Row", nameFr: "Tirage renégat", primaryMuscle: "BACK", secondaryMuscles: ["LATS", "BICEPS", "ABDOMINALS"], equipment: ["DUMBBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "In a push-up position holding dumbbells, row one dumbbell up while stabilizing with the other arm.", descriptionFr: "En position de pompe avec haltères, tirez un haltère vers le haut en stabilisant avec l'autre bras.", introEn: "Renegade rows combine back work with core stabilization.", introFr: "Le tirage renégat combine le travail du dos avec la stabilisation du tronc." },
  { nameEn: "Inverted Row", nameFr: "Tirage inversé", primaryMuscle: "BACK", secondaryMuscles: ["LATS", "BICEPS"], equipment: ["BAR"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Hang under a bar at waist height and pull your chest up to the bar.", descriptionFr: "Suspendu sous une barre à hauteur de taille, tirez votre poitrine vers la barre.", introEn: "Inverted rows are a great bodyweight back exercise for all levels.", introFr: "Le tirage inversé est un excellent exercice au poids du corps pour le dos." },

  // ==================== SHOULDERS ====================
  { nameEn: "Overhead Press", nameFr: "Développé militaire", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRICEPS", "TRAPS"], equipment: ["BARBELL", "DUMBBELL", "MACHINE", "SMITH_MACHINE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Press the weight from shoulder level overhead until your arms are fully extended.", descriptionFr: "Pressez le poids depuis le niveau des épaules au-dessus de la tête jusqu'à extension complète.", introEn: "The overhead press is the fundamental shoulder exercise for strength and size.", introFr: "Le développé militaire est l'exercice fondamental pour la force et le volume des épaules." },
  { nameEn: "Arnold Press", nameFr: "Développé Arnold", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRICEPS"], equipment: ["DUMBBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Press dumbbells overhead while rotating your palms from facing you to facing forward.", descriptionFr: "Pressez les haltères au-dessus de la tête en tournant les paumes de face vers l'avant.", introEn: "The Arnold Press hits all three deltoid heads through a full rotation.", introFr: "Le développé Arnold sollicite les trois faisceaux du deltoïde." },
  { nameEn: "Lateral Raise", nameFr: "Élévation latérale", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRAPS"], equipment: ["DUMBBELL", "CABLE", "MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Raise your arms out to the sides up to shoulder height with a slight bend in the elbows.", descriptionFr: "Levez les bras sur les côtés jusqu'à hauteur des épaules avec une légère flexion des coudes.", introEn: "Lateral raises are the best isolation exercise for the middle deltoid.", introFr: "Les élévations latérales sont le meilleur exercice d'isolation pour le faisceau moyen du deltoïde." },
  { nameEn: "Front Raise", nameFr: "Élévation frontale", primaryMuscle: "SHOULDERS", secondaryMuscles: ["CHEST"], equipment: ["DUMBBELL", "BARBELL", "CABLE", "WEIGHT_PLATE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Raise the weight in front of you to shoulder height keeping your arm straight.", descriptionFr: "Levez le poids devant vous à hauteur des épaules en gardant le bras tendu.", introEn: "Front raises target the anterior deltoid for complete shoulder development.", introFr: "Les élévations frontales ciblent le faisceau antérieur du deltoïde." },
  { nameEn: "Face Pull", nameFr: "Face pull", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRAPS"], equipment: ["CABLE", "BANDS"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Pull a rope attachment toward your face while separating the ends and squeezing your rear delts.", descriptionFr: "Tirez une corde vers votre visage en écartant les extrémités et en contractant les deltoïdes arrière.", introEn: "Face pulls strengthen the rear delts and improve shoulder health.", introFr: "Les face pulls renforcent les deltoïdes arrière et améliorent la santé des épaules." },
  { nameEn: "Reverse Fly", nameFr: "Élévation arrière", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRAPS", "BACK"], equipment: ["DUMBBELL", "CABLE", "MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Bent over, raise the weights out to the sides targeting the rear deltoids.", descriptionFr: "Penché, levez les poids sur les côtés en ciblant les deltoïdes arrière.", introEn: "Reverse flyes isolate the rear deltoids for balanced shoulder development.", introFr: "Les élévations arrière isolent les deltoïdes arrière pour un développement équilibré." },
  { nameEn: "Upright Row", nameFr: "Tirage menton", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRAPS", "BICEPS"], equipment: ["BARBELL", "DUMBBELL", "CABLE", "EZ_BAR"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Hold the weight with a narrow grip and pull it up to chin level leading with your elbows.", descriptionFr: "Tenez le poids avec une prise étroite et tirez-le jusqu'au niveau du menton en guidant avec les coudes.", introEn: "Upright rows target the side delts and traps simultaneously.", introFr: "Le tirage menton cible les deltoïdes latéraux et les trapèzes." },
  { nameEn: "Pike Push-Up", nameFr: "Pompe pike", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRICEPS", "CHEST"], equipment: ["BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "In an inverted V position, bend your elbows to lower your head toward the floor then push back up.", descriptionFr: "En position de V inversé, fléchissez les coudes pour abaisser la tête vers le sol puis remontez.", introEn: "Pike push-ups are an excellent bodyweight shoulder exercise.", introFr: "Les pompes pike sont un excellent exercice d'épaules au poids du corps." },
  { nameEn: "Handstand Push-Up", nameFr: "Pompe en équilibre", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRICEPS", "TRAPS"], equipment: ["BODY_ONLY", "WALL"], mechanicsType: "COMPOUND", exerciseType: "CALISTHENIC", descriptionEn: "In a handstand position against a wall, lower your head toward the floor then push back up.", descriptionFr: "En équilibre sur les mains contre un mur, descendez la tête vers le sol puis remontez.", introEn: "Handstand push-ups build incredible shoulder strength and stability.", introFr: "Les pompes en équilibre développent une force et une stabilité incroyables des épaules." },

  // ==================== BICEPS ====================
  { nameEn: "Curl", nameFr: "Curl", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: ["BARBELL", "DUMBBELL", "CABLE", "EZ_BAR"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Hold the weight with an underhand grip and curl it toward your shoulders by bending your elbows.", descriptionFr: "Tenez le poids en prise supination et curl-le vers les épaules en fléchissant les coudes.", introEn: "Curls are the fundamental bicep exercise for building arm size.", introFr: "Les curls sont l'exercice fondamental pour le volume des biceps." },
  { nameEn: "Hammer Curl", nameFr: "Curl marteau", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: ["DUMBBELL", "CABLE", "BANDS"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Curl the weight with a neutral grip (palms facing each other) to target the brachialis.", descriptionFr: "Curl le poids avec une prise neutre (paumes face à face) pour cibler le brachial.", introEn: "Hammer curls target the brachialis for thicker arms.", introFr: "Les curls marteau ciblent le brachial pour des bras plus épais." },
  { nameEn: "Preacher Curl", nameFr: "Curl prêcheur", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: ["BARBELL", "DUMBBELL", "EZ_BAR", "MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Perform curls with your arms resting on a preacher bench to eliminate body english.", descriptionFr: "Effectuez des curls avec les bras posés sur un banc prêcheur pour éliminer la triche.", introEn: "Preacher curls isolate the biceps by removing momentum.", introFr: "Les curls prêcheur isolent les biceps en supprimant l'élan." },
  { nameEn: "Concentration Curl", nameFr: "Curl concentration", primaryMuscle: "BICEPS", equipment: ["DUMBBELL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Seated with your elbow braced against your inner thigh, curl the dumbbell up for maximum bicep isolation.", descriptionFr: "Assis avec le coude bloqué contre l'intérieur de la cuisse, curl l'haltère pour une isolation maximale.", introEn: "Concentration curls provide the ultimate bicep isolation and mind-muscle connection.", introFr: "Les curls concentration offrent l'isolation ultime des biceps." },
  { nameEn: "Incline Curl", nameFr: "Curl incliné", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: ["DUMBBELL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Lie back on an incline bench and curl the dumbbells for a deep stretch on the biceps.", descriptionFr: "Allongé sur un banc incliné, curl les haltères pour un étirement profond des biceps.", introEn: "Incline curls stretch the long head of the bicep for maximum growth.", introFr: "Les curls inclinés étirent la longue portion du biceps." },
  { nameEn: "Spider Curl", nameFr: "Curl spider", primaryMuscle: "BICEPS", equipment: ["DUMBBELL", "BARBELL", "EZ_BAR"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Lie face down on an incline bench and curl the weight with your arms hanging straight down.", descriptionFr: "Allongé face contre terre sur un banc incliné, curl le poids bras suspendus.", introEn: "Spider curls maintain constant tension on the biceps throughout the entire range.", introFr: "Les curls spider maintiennent une tension constante sur les biceps." },
  { nameEn: "Cable Curl", nameFr: "Curl câble", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: ["CABLE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Perform curls using a cable machine for constant tension throughout the movement.", descriptionFr: "Effectuez des curls à la poulie pour une tension constante tout au long du mouvement.", introEn: "Cable curls provide continuous tension that free weights cannot match.", introFr: "Les curls câble offrent une tension continue que les poids libres ne peuvent égaler." },
  { nameEn: "Chin-Up (Bicep Focus)", nameFr: "Traction supination biceps", primaryMuscle: "BICEPS", secondaryMuscles: ["BACK", "LATS"], equipment: ["PULLUP_BAR"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Perform chin-ups with an underhand grip to heavily target the biceps.", descriptionFr: "Effectuez des tractions en prise supination pour cibler fortement les biceps.", introEn: "Underhand chin-ups are one of the best compound bicep exercises.", introFr: "Les tractions supination sont l'un des meilleurs exercices composés pour les biceps." },
  { nameEn: "Reverse Curl", nameFr: "Curl inversé", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: ["BARBELL", "DUMBBELL", "EZ_BAR"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Curl the weight with an overhand grip to target the brachialis and forearms.", descriptionFr: "Curl le poids en prise pronation pour cibler le brachial et les avant-bras.", introEn: "Reverse curls target the brachialis to push the bicep up for a bigger arm.", introFr: "Les curls inversés ciblent le brachial pour repousser le biceps vers le haut." },

  // ==================== TRICEPS ====================
  { nameEn: "Tricep Pushdown", nameFr: "Extension triceps poulie", primaryMuscle: "TRICEPS", equipment: ["CABLE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "At a high cable, push the bar or rope down by extending your elbows until arms are straight.", descriptionFr: "À la poulie haute, poussez la barre ou la corde vers le bas en étendant les coudes.", introEn: "Tricep pushdowns are the most popular tricep isolation exercise.", introFr: "L'extension triceps à la poulie est l'exercice d'isolation le plus populaire." },
  { nameEn: "Overhead Tricep Extension", nameFr: "Extension triceps au-dessus de la tête", primaryMuscle: "TRICEPS", equipment: ["DUMBBELL", "CABLE", "BARBELL", "EZ_BAR"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Hold the weight overhead and lower it behind your head by bending your elbows, then extend back up.", descriptionFr: "Tenez le poids au-dessus de la tête et abaissez-le derrière la tête en fléchissant les coudes.", introEn: "Overhead extensions target the long head of the tricep for full development.", introFr: "Les extensions au-dessus de la tête ciblent la longue portion du triceps." },
  { nameEn: "Skull Crusher", nameFr: "Barre au front", primaryMuscle: "TRICEPS", equipment: ["BARBELL", "EZ_BAR", "DUMBBELL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Lie on a bench holding the weight above your chest. Bend your elbows to lower it to your forehead, then extend.", descriptionFr: "Allongé sur un banc, tenez le poids au-dessus de la poitrine. Fléchissez les coudes pour l'abaisser vers le front.", introEn: "Skull crushers are a classic mass builder for the triceps.", introFr: "La barre au front est un classique pour la masse des triceps." },
  { nameEn: "Close-Grip Bench Press", nameFr: "Développé couché prise serrée", primaryMuscle: "TRICEPS", secondaryMuscles: ["CHEST", "SHOULDERS"], equipment: ["BARBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Perform a bench press with a shoulder-width grip to shift emphasis to the triceps.", descriptionFr: "Effectuez un développé couché avec une prise à la largeur des épaules pour cibler les triceps.", introEn: "Close-grip bench press allows heavy loading for tricep strength.", introFr: "Le développé couché prise serrée permet des charges lourdes pour la force des triceps." },
  { nameEn: "Tricep Dip", nameFr: "Dips triceps", primaryMuscle: "TRICEPS", secondaryMuscles: ["CHEST", "SHOULDERS"], equipment: ["BODY_ONLY", "MACHINE"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "On parallel bars or a dip machine, lower your body by bending your arms then push back up, staying upright.", descriptionFr: "Aux barres parallèles ou à la machine, descendez en fléchissant les bras puis remontez en restant droit.", introEn: "Dips are a powerful compound tricep exercise.", introFr: "Les dips sont un puissant exercice composé pour les triceps." },
  { nameEn: "Tricep Kickback", nameFr: "Kickback triceps", primaryMuscle: "TRICEPS", equipment: ["DUMBBELL", "CABLE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Bent over, extend your arm back by straightening the elbow to contract the tricep.", descriptionFr: "Penché, étendez le bras vers l'arrière en redressant le coude pour contracter le triceps.", introEn: "Kickbacks isolate the tricep with a strong contraction at the top.", introFr: "Les kickbacks isolent le triceps avec une forte contraction en position haute." },
  { nameEn: "Diamond Push-Up (Tricep)", nameFr: "Pompe diamant triceps", primaryMuscle: "TRICEPS", secondaryMuscles: ["CHEST"], equipment: ["BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Perform push-ups with hands close together under your chest to emphasize the triceps.", descriptionFr: "Effectuez des pompes avec les mains rapprochées sous la poitrine pour cibler les triceps.", introEn: "Diamond push-ups are an effective bodyweight tricep exercise.", introFr: "Les pompes diamant sont un exercice efficace au poids du corps pour les triceps." },
  { nameEn: "JM Press", nameFr: "Press JM", primaryMuscle: "TRICEPS", secondaryMuscles: ["CHEST"], equipment: ["BARBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "A hybrid between a close-grip bench press and skull crusher, lower the bar to chin level then press up.", descriptionFr: "Un hybride entre le développé couché prise serrée et la barre au front, abaissez la barre au niveau du menton.", introEn: "The JM Press combines the best of close-grip bench and skull crushers.", introFr: "Le press JM combine le meilleur du développé serré et de la barre au front." },
  { nameEn: "Floor Skull Crusher", nameFr: "Barre au front au sol", primaryMuscle: "TRICEPS", equipment: ["BARBELL", "EZ_BAR", "DUMBBELL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Perform skull crushers lying on the floor for reduced shoulder involvement.", descriptionFr: "Effectuez des extensions triceps allongé au sol pour réduire l'implication des épaules.", introEn: "Floor skull crushers reduce shoulder strain while targeting the triceps.", introFr: "La barre au front au sol réduit la tension sur les épaules tout en ciblant les triceps." },

  // ==================== QUADRICEPS ====================
  { nameEn: "Back Squat", nameFr: "Squat arrière", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES", "HAMSTRINGS"], equipment: ["BARBELL"], mechanicsType: "COMPOUND", exerciseType: "POWERLIFTING", descriptionEn: "With the bar on your upper back, squat down until your thighs are parallel to the floor, then stand up.", descriptionFr: "La barre sur les trapèzes, descendez en squat jusqu'à ce que les cuisses soient parallèles au sol.", introEn: "The back squat is the king of leg exercises for overall lower body strength.", introFr: "Le squat arrière est le roi des exercices de jambes pour la force globale." },
  { nameEn: "Front Squat", nameFr: "Squat avant", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES", "ABDOMINALS"], equipment: ["BARBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "With the bar in the front rack position, squat down keeping your torso upright, then stand up.", descriptionFr: "La barre en position front rack, descendez en squat en gardant le buste droit, puis levez-vous.", introEn: "Front squats emphasize the quads more than back squats due to the upright torso.", introFr: "Le squat avant sollicite davantage les quadriceps grâce au buste plus droit." },
  { nameEn: "Goblet Squat", nameFr: "Goblet squat", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES", "ABDOMINALS"], equipment: ["DUMBBELL", "KETTLEBELLS"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Hold a weight at chest level and squat down, keeping your chest up and elbows inside your knees.", descriptionFr: "Tenez un poids au niveau de la poitrine et descendez en squat en gardant le buste droit.", introEn: "Goblet squats are beginner-friendly and improve squat mechanics.", introFr: "Le goblet squat est accessible aux débutants et améliore la technique du squat." },
  { nameEn: "Leg Press", nameFr: "Presse à cuisses", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES"], equipment: ["MACHINE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Sit in the leg press machine and push the platform away by extending your legs.", descriptionFr: "Asseyez-vous dans la presse à cuisses et poussez la plateforme en étendant les jambes.", introEn: "Leg press allows heavy quad loading with minimal back stress.", introFr: "La presse à cuisses permet des charges lourdes avec un stress minimal sur le dos." },
  { nameEn: "Leg Extension", nameFr: "Extension jambes", primaryMuscle: "QUADRICEPS", equipment: ["MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Sit on the machine and extend your legs to straighten them against the resistance.", descriptionFr: "Asseyez-vous sur la machine et étendez les jambes contre la résistance.", introEn: "Leg extensions isolate the quads for targeted development.", introFr: "L'extension jambes isole les quadriceps pour un développement ciblé." },
  { nameEn: "Lunge", nameFr: "Fente", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES", "HAMSTRINGS"], equipment: ["BARBELL", "DUMBBELL", "BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Step forward and lower your body until both knees are at 90 degrees, then push back.", descriptionFr: "Faites un pas en avant et descendez jusqu'à ce que les deux genoux forment un angle de 90 degrés.", introEn: "Lunges are a fundamental unilateral leg exercise for balance and strength.", introFr: "Les fentes sont un exercice fondamental unilatéral pour l'équilibre et la force." },
  { nameEn: "Reverse Lunge", nameFr: "Fente arrière", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES", "HAMSTRINGS"], equipment: ["BARBELL", "DUMBBELL", "BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Step backward and lower your body until both knees are at 90 degrees, then return to standing.", descriptionFr: "Faites un pas en arrière et descendez jusqu'à ce que les deux genoux forment un angle de 90 degrés.", introEn: "Reverse lunges are easier on the knees than forward lunges.", introFr: "Les fentes arrière sont plus douces pour les genoux que les fentes avant." },
  { nameEn: "Bulgarian Split Squat", nameFr: "Squat bulgare", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES", "HAMSTRINGS"], equipment: ["DUMBBELL", "BARBELL", "BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "With one foot behind you on a bench, lower into a squat then push back up.", descriptionFr: "Un pied derrière vous sur un banc, descendez en squat puis remontez.", introEn: "Bulgarian split squats are excellent for unilateral quad development.", introFr: "Le squat bulgare est excellent pour le développement unilatéral des quadriceps." },
  { nameEn: "Hack Squat", nameFr: "Hack squat", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES"], equipment: ["MACHINE", "BARBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "On the hack squat machine or with a barbell behind your legs, squat down and push back up.", descriptionFr: "Sur la machine hack squat ou avec une barre derrière les jambes, descendez et remontez.", introEn: "Hack squats isolate the quads with less spinal loading.", introFr: "Le hack squat isole les quadriceps avec moins de charge sur la colonne." },
  { nameEn: "Sissy Squat", nameFr: "Sissy squat", primaryMuscle: "QUADRICEPS", equipment: ["BODY_ONLY", "MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Lean back with straight hips and bend your knees to lower your body, then straighten your legs.", descriptionFr: "Penchez-vous en arrière avec les hanches droites et fléchissez les genoux pour descendre.", introEn: "Sissy squats isolate the quads through a unique movement pattern.", introFr: "Le sissy squat isole les quadriceps grâce à un mouvement unique." },
  { nameEn: "Wall Sit", nameFr: "Chaise romaine", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES"], equipment: ["BODY_ONLY", "WALL"], mechanicsType: "ISOLATION", exerciseType: "BODYWEIGHT", descriptionEn: "Sit against a wall with your thighs parallel to the floor and hold the position.", descriptionFr: "Adossez-vous au mur avec les cuisses parallèles au sol et maintenez la position.", introEn: "Wall sits build quad endurance and mental toughness.", introFr: "La chaise romaine développe l'endurance des quadriceps." },
  { nameEn: "Step-Up", nameFr: "Montée sur banc", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES", "HAMSTRINGS"], equipment: ["DUMBBELL", "BARBELL", "BODY_ONLY", "BENCH"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Step up onto a bench or platform, driving through your front leg, then step back down.", descriptionFr: "Montez sur un banc ou une plateforme en poussant avec la jambe avant, puis redescendez.", introEn: "Step-ups are a functional exercise for unilateral leg strength.", introFr: "Les montées sur banc sont un exercice fonctionnel pour la force unilatérale." },

  // ==================== HAMSTRINGS ====================
  { nameEn: "Romanian Deadlift", nameFr: "Soulevé de terre roumain", primaryMuscle: "HAMSTRINGS", secondaryMuscles: ["GLUTES", "BACK"], equipment: ["BARBELL", "DUMBBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Hinge at the hips keeping your legs slightly bent, lower the weight down your legs, then return to standing.", descriptionFr: "Fléchissez les hanches en gardant les jambes légèrement fléchies, abaissez le poids le long des jambes.", introEn: "RDLs are the best exercise for hamstring and glute development.", introFr: "Le RDL est le meilleur exercice pour le développement des ischio-jambiers et fessiers." },
  { nameEn: "Leg Curl", nameFr: "Curl jambes", primaryMuscle: "HAMSTRINGS", equipment: ["MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "On a leg curl machine (lying or seated), curl the pad toward your glutes by bending your knees.", descriptionFr: "Sur une machine à curl jambes (allongé ou assis), curl le coussinet vers les fessiers.", introEn: "Leg curls are the primary isolation exercise for the hamstrings.", introFr: "Le curl jambes est le principal exercice d'isolation pour les ischio-jambiers." },
  { nameEn: "Good Morning", nameFr: "Good morning", primaryMuscle: "HAMSTRINGS", secondaryMuscles: ["GLUTES", "BACK"], equipment: ["BARBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "With the bar on your back, hinge forward at the hips keeping your legs straight, then stand back up.", descriptionFr: "La barre sur le dos, penchez-vous en avant aux hanches en gardant les jambes tendues.", introEn: "Good mornings build hamstring and lower back strength.", introFr: "Le good morning développe la force des ischio-jambiers et du bas du dos." },
  { nameEn: "Nordic Hamstring Curl", nameFr: "Curl nordique", primaryMuscle: "HAMSTRINGS", equipment: ["BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "BODYWEIGHT", descriptionEn: "Kneeling with your feet anchored, slowly lower your body forward by extending your knees, then pull yourself back.", descriptionFr: "À genoux avec les pieds fixés, abaissez lentement votre corps vers l'avant en étendant les genoux.", introEn: "Nordic curls are excellent for hamstring injury prevention.", introFr: "Les curls nordiques sont excellents pour la prévention des blessures aux ischio-jambiers." },
  { nameEn: "Swiss Ball Leg Curl", nameFr: "Curl jambes ballon suisse", primaryMuscle: "HAMSTRINGS", secondaryMuscles: ["GLUTES", "ABDOMINALS"], equipment: ["SWISS_BALL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Lie on your back with feet on a Swiss ball. Bridge up and curl the ball toward your glutes.", descriptionFr: "Allongé sur le dos avec les pieds sur un ballon suisse. Levez les hanches et curl le ballon vers les fessiers.", introEn: "Swiss ball curls challenge hamstrings and core stability.", introFr: "Le curl ballon suisse stimule les ischio-jambiers et la stabilité du tronc." },
  { nameEn: "Stiff-Leg Deadlift", nameFr: "Soulevé de terre jambes tendues", primaryMuscle: "HAMSTRINGS", secondaryMuscles: ["GLUTES", "BACK"], equipment: ["BARBELL", "DUMBBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Similar to RDL but with completely straight legs, lower the weight and feel the hamstring stretch.", descriptionFr: "Similaire au RDL mais avec les jambes complètement tendues, abaissez le poids et sentez l'étirement.", introEn: "Stiff-leg deadlifts maximize hamstring stretch and engagement.", introFr: "Le soulevé de terre jambes tendues maximise l'étirement des ischio-jambiers." },

  // ==================== GLUTES ====================
  { nameEn: "Hip Thrust", nameFr: "Hip thrust", primaryMuscle: "GLUTES", secondaryMuscles: ["HAMSTRINGS"], equipment: ["BARBELL", "DUMBBELL", "MACHINE", "BANDS"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "With your upper back on a bench and weight on your hips, drive your hips up squeezing your glutes.", descriptionFr: "Le haut du dos sur un banc et le poids sur les hanches, poussez les hanches vers le haut.", introEn: "Hip thrusts are the best exercise for glute development.", introFr: "Le hip thrust est le meilleur exercice pour le développement des fessiers." },
  { nameEn: "Glute Bridge", nameFr: "Pont fessier", primaryMuscle: "GLUTES", secondaryMuscles: ["HAMSTRINGS"], equipment: ["BODY_ONLY", "BARBELL", "DUMBBELL", "BANDS"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Lie on your back with knees bent and drive your hips up by squeezing your glutes.", descriptionFr: "Allongé sur le dos avec les genoux fléchis, poussez les hanches vers le haut en contractant les fessiers.", introEn: "Glute bridges are the foundation for glute activation and strength.", introFr: "Le pont fessier est la base pour l'activation et la force des fessiers." },
  { nameEn: "Cable Glute Kickback", nameFr: "Kickback fessier câble", primaryMuscle: "GLUTES", secondaryMuscles: ["HAMSTRINGS"], equipment: ["CABLE", "BANDS"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Attach an ankle strap to a low cable and kick your leg back, squeezing your glute at the top.", descriptionFr: "Attachez une sangle de cheville à la poulie basse et donnez un coup de pied en arrière.", introEn: "Cable kickbacks isolate the gluteus maximus effectively.", introFr: "Le kickback câble isole efficacement le grand fessier." },
  { nameEn: "Glute-Focused Back Extension", nameFr: "Extension lombaire fessiers", primaryMuscle: "GLUTES", secondaryMuscles: ["HAMSTRINGS", "BACK"], equipment: ["MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "On a back extension bench, round your back and extend using your glutes rather than your lower back.", descriptionFr: "Sur un banc d'extension lombaire, arrondissez le dos et étendez en utilisant les fessiers.", introEn: "This variation targets the glutes rather than the erector spinae.", introFr: "Cette variante cible les fessiers plutôt que les lombaires." },
  { nameEn: "Lateral Band Walk", nameFr: "Marche latérale élastique", primaryMuscle: "GLUTES", secondaryMuscles: ["ABDUCTORS"], equipment: ["BANDS"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "With a band around your ankles, take side steps while keeping tension on the band.", descriptionFr: "Avec un élastique autour des chevilles, faites des pas latéraux en gardant la tension.", introEn: "Lateral band walks target the gluteus medius for hip stability.", introFr: "La marche latérale élastique cible le moyen fessier." },
  { nameEn: "Barbell Squat (Glute Focus)", nameFr: "Squat barre fessiers", primaryMuscle: "GLUTES", secondaryMuscles: ["QUADRICEPS", "HAMSTRINGS"], equipment: ["BARBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Perform a deep squat with a wider stance and more forward lean to emphasize the glutes.", descriptionFr: "Effectuez un squat profond avec une position plus large et plus penché pour cibler les fessiers.", introEn: "Deep wide-stance squats shift emphasis to the glutes.", introFr: "Les squats profonds avec une position large ciblent les fessiers." },
  { nameEn: "Kettlebell Swing", nameFr: "Swing kettlebell", primaryMuscle: "GLUTES", secondaryMuscles: ["HAMSTRINGS", "BACK"], equipment: ["KETTLEBELLS"], mechanicsType: "COMPOUND", exerciseType: "POWER", descriptionEn: "Hinge at the hips and swing the kettlebell forward by forcefully extending your hips.", descriptionFr: "Fléchissez les hanches et balancez le kettlebell vers l'avant en étendant les hanches avec force.", introEn: "Kettlebell swings build explosive hip power and glute strength.", introFr: "Le swing kettlebell développe la puissance explosive des hanches et la force des fessiers." },

  // ==================== ABDOMINALS ====================
  { nameEn: "Crunch", nameFr: "Crunch", primaryMuscle: "ABDOMINALS", equipment: ["BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "BODYWEIGHT", descriptionEn: "Lie on your back and curl your shoulders off the floor by contracting your abs.", descriptionFr: "Allongé sur le dos, soulevez les épaules du sol en contractant les abdominaux.", introEn: "Crunches are the basic abdominal isolation exercise.", introFr: "Les crunchs sont l'exercice de base pour l'isolation abdominale." },
  { nameEn: "Plank", nameFr: "Planche", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["SHOULDERS"], equipment: ["BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Hold a push-up position on your forearms, keeping your body in a straight line.", descriptionFr: "Maintenez la position de pompe sur les avant-bras, le corps aligné.", introEn: "Planks build core endurance and stability.", introFr: "La planche développe l'endurance et la stabilité du tronc." },
  { nameEn: "Hanging Leg Raise", nameFr: "Relevé de jambes suspendu", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["HIP_FLEXOR"], equipment: ["PULLUP_BAR"], mechanicsType: "ISOLATION", exerciseType: "BODYWEIGHT", descriptionEn: "Hang from a bar and raise your straight legs until they are parallel to the floor.", descriptionFr: "Suspendu à une barre, levez les jambes tendues jusqu'à ce qu'elles soient parallèles au sol.", introEn: "Hanging leg raises are an advanced ab exercise targeting the lower abs.", introFr: "Le relevé de jambes suspendu est un exercice avancé pour les abdominaux inférieurs." },
  { nameEn: "Russian Twist", nameFr: "Twist russe", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["OBLIQUES"], equipment: ["BODY_ONLY", "DUMBBELL", "WEIGHT_PLATE", "MEDICINE_BALL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Sit with your torso angled back and twist side to side, optionally holding a weight.", descriptionFr: "Asseyez-vous en penchant le buste en arrière et tournez de gauche à droite.", introEn: "Russian twists target the obliques and rotational core strength.", introFr: "Le twist russe cible les obliques et la force rotationnelle." },
  { nameEn: "Cable Crunch", nameFr: "Crunch câble", primaryMuscle: "ABDOMINALS", equipment: ["CABLE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Kneel in front of a high cable and crunch down by contracting your abs.", descriptionFr: "À genoux devant une poulie haute, crunch vers le bas en contractant les abdominaux.", introEn: "Cable crunches allow progressive overload for ab training.", introFr: "Les crunchs câble permettent une surcharge progressive pour les abdominaux." },
  { nameEn: "Ab Wheel Rollout", nameFr: "Roue abdominale", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["SHOULDERS", "BACK"], equipment: ["OTHER"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Kneel with an ab wheel and roll it forward, then pull yourself back using your core.", descriptionFr: "À genoux avec une roue abdominale, roulez vers l'avant, puis tirez pour revenir.", introEn: "Ab wheel rollouts are one of the most challenging core exercises.", introFr: "La roue abdominale est l'un des exercices les plus exigeants pour le tronc." },
  { nameEn: "Mountain Climber", nameFr: "Alpiniste", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["HIP_FLEXOR", "SHOULDERS"], equipment: ["BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "CARDIO", descriptionEn: "In a push-up position, alternately drive your knees toward your chest at a quick pace.", descriptionFr: "En position de pompe, ramenez alternativement les genoux vers la poitrine rapidement.", introEn: "Mountain climbers combine core work with cardio.", introFr: "Les alpinistes combinent le travail du tronc avec le cardio." },
  { nameEn: "Dead Bug", nameFr: "Dead bug", primaryMuscle: "ABDOMINALS", equipment: ["BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "BODYWEIGHT", descriptionEn: "Lie on your back and alternately extend opposite arm and leg while keeping your lower back pressed to the floor.", descriptionFr: "Allongé sur le dos, étendez alternativement le bras et la jambe opposés en gardant le bas du dos plaqué.", introEn: "Dead bugs teach core stability while moving the limbs.", introFr: "Le dead bug enseigne la stabilité du tronc en mouvant les membres." },
  { nameEn: "V-Up", nameFr: "V-Up", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["HIP_FLEXOR"], equipment: ["BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "BODYWEIGHT", descriptionEn: "Lie flat and simultaneously raise your legs and torso to form a V shape.", descriptionFr: "Allongé, levez simultanément les jambes et le buste pour former un V.", introEn: "V-ups are an advanced ab exercise working the entire core.", introFr: "Le V-Up est un exercice avancé qui travaille tout le tronc." },
  { nameEn: "Side Plank", nameFr: "Planche latérale", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["OBLIQUES"], equipment: ["BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "BODYWEIGHT", descriptionEn: "Hold a plank position on your side, supported by one forearm and the edge of your foot.", descriptionFr: "Maintenez la position de planche sur le côté, soutenu par un avant-bras et le bord du pied.", introEn: "Side planks target the obliques and lateral core stability.", introFr: "La planche latérale cible les obliques et la stabilité latérale." },
  { nameEn: "Bicycle Crunch", nameFr: "Crunch vélo", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["OBLIQUES"], equipment: ["BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "BODYWEIGHT", descriptionEn: "Lie on your back and alternate bringing your elbow to the opposite knee in a cycling motion.", descriptionFr: "Allongé, alternez en amenant le coude vers le genou opposé dans un mouvement de pédalage.", introEn: "Bicycle crunches are one of the most effective ab exercises.", introFr: "Le crunch vélo est l'un des exercices les plus efficaces pour les abdominaux." },
  { nameEn: "TRX Pendulum", nameFr: "Pendule TRX", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["OBLIQUES"], equipment: ["TRX"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "With feet in TRX straps in a plank position, swing your legs side to side.", descriptionFr: "Pieds dans les sangles TRX en planche, balancez les jambes de côté.", introEn: "TRX pendulum challenges core stability and obliques.", introFr: "Le pendule TRX stimule la stabilité du tronc et les obliques." },

  // ==================== CALVES ====================
  { nameEn: "Standing Calf Raise", nameFr: "Mollet debout", primaryMuscle: "CALVES", equipment: ["MACHINE", "DUMBBELL", "BARBELL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Stand on a raised surface and rise up on your toes, then lower below the level of the step.", descriptionFr: "Debout sur une surface surélevée, levez-vous sur la pointe des pieds, puis redescendez.", introEn: "Standing calf raises target the gastrocnemius for calf development.", introFr: "Le mollet debout cible le gastrocnémien pour le développement des mollets." },
  { nameEn: "Seated Calf Raise", nameFr: "Mollet assis", primaryMuscle: "CALVES", equipment: ["MACHINE", "DUMBBELL", "BARBELL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Sit with weight on your knees and raise your heels by flexing your calves.", descriptionFr: "Assis avec le poids sur les genoux, levez les talons en fléchissant les mollets.", introEn: "Seated calf raises target the soleus muscle beneath the gastrocnemius.", introFr: "Le mollet assis cible le soléaire sous le gastrocnémien." },
  { nameEn: "Donkey Calf Raise", nameFr: "Mollet âne", primaryMuscle: "CALVES", equipment: ["MACHINE", "BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Bent over at the waist, raise your heels to contract your calves.", descriptionFr: "Penché à la taille, levez les talons pour contracter les mollets.", introEn: "Donkey calf raises allow heavy loading of the calves.", introFr: "Le mollet âne permet des charges lourdes sur les mollets." },
  { nameEn: "Calf Press on Leg Press", nameFr: "Mollet presse", primaryMuscle: "CALVES", equipment: ["MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "On the leg press machine, press the platform using only your toes and calves.", descriptionFr: "Sur la presse à cuisses, poussez la plateforme uniquement avec les orteils et les mollets.", introEn: "Leg press calf raises are an effective way to load the calves heavily.", introFr: "Le mollet presse est un moyen efficace de charger les mollets." },

  // ==================== FOREARMS ====================
  { nameEn: "Wrist Curl", nameFr: "Curl poignet", primaryMuscle: "FOREARMS", equipment: ["BARBELL", "DUMBBELL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Sit with forearms on your thighs and curl the weight by flexing your wrists upward.", descriptionFr: "Assis avec les avant-bras sur les cuisses, curl le poids en fléchissant les poignets vers le haut.", introEn: "Wrist curls target the forearm flexors for grip strength.", introFr: "Le curl poignet cible les fléchisseurs de l'avant-bras." },
  { nameEn: "Reverse Wrist Curl", nameFr: "Curl poignet inversé", primaryMuscle: "FOREARMS", equipment: ["BARBELL", "DUMBBELL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "With an overhand grip, extend your wrists upward to target the forearm extensors.", descriptionFr: "En prise pronation, étendez les poignets vers le haut pour cibler les extenseurs.", introEn: "Reverse wrist curls target the forearm extensors for balanced development.", introFr: "Le curl poignet inversé cible les extenseurs de l'avant-bras." },
  { nameEn: "Farmer's Walk", nameFr: "Marche du fermier", primaryMuscle: "FOREARMS", secondaryMuscles: ["TRAPS", "FULL_BODY"], equipment: ["DUMBBELL", "BARBELL"], mechanicsType: "COMPOUND", exerciseType: "STRONGMAN", descriptionEn: "Carry heavy weights in each hand and walk for distance or time.", descriptionFr: "Portez des poids lourds dans chaque main et marchez sur une distance ou un temps donné.", introEn: "Farmer's walks build incredible grip strength and total body stability.", introFr: "La marche du fermier développe une force de préhension incroyable." },
  { nameEn: "Plate Pinch", nameFr: "Pincement de disque", primaryMuscle: "FOREARMS", equipment: ["WEIGHT_PLATE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Pinch two weight plates together with your fingers and hold for time.", descriptionFr: "Pincez deux disques ensemble avec vos doigts et maintenez.", introEn: "Plate pinches build pinch grip strength for forearm development.", introFr: "Le pincement de disque développe la force de pincement." },
  { nameEn: "Dead Hang", nameFr: "Suspension", primaryMuscle: "FOREARMS", secondaryMuscles: ["LATS", "SHOULDERS"], equipment: ["PULLUP_BAR"], mechanicsType: "ISOLATION", exerciseType: "BODYWEIGHT", descriptionEn: "Hang from a pull-up bar with straight arms for as long as possible.", descriptionFr: "Suspendez-vous à une barre de traction bras tendus le plus longtemps possible.", introEn: "Dead hangs build grip endurance and shoulder stability.", introFr: "La suspension développe l'endurance de préhension." },

  // ==================== TRAPS ====================
  { nameEn: "Shrug", nameFr: "Haussement d'épaules", primaryMuscle: "TRAPS", secondaryMuscles: ["SHOULDERS"], equipment: ["BARBELL", "DUMBBELL", "CABLE", "MACHINE", "SMITH_MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Hold the weight at your sides and shrug your shoulders up toward your ears, then release.", descriptionFr: "Tenez le poids sur les côtés et haussez les épaules vers les oreilles, puis relâchez.", introEn: "Shrugs are the primary exercise for upper trap development.", introFr: "Les shrugs sont l'exercice principal pour le développement des trapèzes supérieurs." },
  { nameEn: "Farmer's Walk (Traps)", nameFr: "Marche du fermier trapèzes", primaryMuscle: "TRAPS", secondaryMuscles: ["FOREARMS", "SHOULDERS"], equipment: ["DUMBBELL", "BARBELL"], mechanicsType: "COMPOUND", exerciseType: "STRONGMAN", descriptionEn: "Carry heavy weights at your sides and walk, keeping your shoulders pulled back.", descriptionFr: "Portez des poids lourds sur les côtés et marchez en gardant les épaules tirées en arrière.", introEn: "Farmer's walks build trap endurance and overall stability.", introFr: "La marche du fermier développe l'endurance des trapèzes." },
  { nameEn: "Rack Pull", nameFr: "Tirage partiel", primaryMuscle: "TRAPS", secondaryMuscles: ["BACK", "GLUTES"], equipment: ["BARBELL", "RACK"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Perform a partial deadlift from the rack pins, focusing on the top portion of the movement.", descriptionFr: "Effectuez un soulevé de terre partiel depuis les taquets, en vous concentrant sur la partie haute.", introEn: "Rack pulls allow maximum loading for traps and back.", introFr: "Le tirage partiel permet une charge maximale pour les trapèzes et le dos." },
  { nameEn: "Y-Raise", nameFr: "Élévation en Y", primaryMuscle: "TRAPS", secondaryMuscles: ["SHOULDERS", "BACK"], equipment: ["DUMBBELL", "CABLE", "BANDS"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Lie face down and raise your arms in a Y shape to target the lower traps.", descriptionFr: "Allongé face contre terre, levez les bras en forme de Y pour cibler les trapèzes inférieurs.", introEn: "Y-raises target the often-neglected lower traps for shoulder health.", introFr: "Les élévations en Y ciblent les trapèzes inférieurs souvent négligés." },

  // ==================== LATS ====================
  { nameEn: "Pullover", nameFr: "Pull-over", primaryMuscle: "LATS", secondaryMuscles: ["CHEST"], equipment: ["DUMBBELL", "BARBELL", "CABLE", "MACHINE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Lie on a bench and lower the weight behind your head, then pull it back over your chest.", descriptionFr: "Allongé sur un banc, abaissez le poids derrière la tête puis ramenez-le au-dessus de la poitrine.", introEn: "Pullovers are a unique exercise that works both lats and chest.", introFr: "Le pull-over est un exercice unique qui travaille les dorsaux et les pectoraux." },
  { nameEn: "Close-Grip Lat Pulldown", nameFr: "Tirage vertical prise serrée", primaryMuscle: "LATS", secondaryMuscles: ["BICEPS", "BACK"], equipment: ["CABLE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Perform lat pulldowns with a close grip to emphasize the lower lats.", descriptionFr: "Effectuez le tirage vertical avec une prise serrée pour cibler les dorsaux inférieurs.", introEn: "Close-grip lat pulldowns target the lower lats for back width.", introFr: "Le tirage vertical prise serrée cible les dorsaux inférieurs." },

  // ==================== ADDUCTORS ====================
  { nameEn: "Adductor Machine", nameFr: "Machine adducteurs", primaryMuscle: "ADDUCTORS", equipment: ["MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Sit in the adductor machine and squeeze your legs together against the resistance.", descriptionFr: "Asseyez-vous dans la machine adducteurs et serrez les jambes ensemble contre la résistance.", introEn: "The adductor machine isolates the inner thigh muscles.", introFr: "La machine adducteurs isole les muscles de l'intérieur des cuisses." },
  { nameEn: "Copenhagen Plank", nameFr: "Planche Copenhague", primaryMuscle: "ADDUCTORS", secondaryMuscles: ["ABDOMINALS"], equipment: ["BODY_ONLY", "BENCH"], mechanicsType: "ISOLATION", exerciseType: "BODYWEIGHT", descriptionEn: "In a side plank with your top leg on a bench, hold the position using your adductors.", descriptionFr: "En planche latérale avec la jambe supérieure sur un banc, maintenez la position avec les adducteurs.", introEn: "Copenhagen planks are a challenging adductor and core exercise.", introFr: "La planche Copenhague est un exercice exigeant pour les adducteurs et le tronc." },
  { nameEn: "Sumo Squat", nameFr: "Squat sumo", primaryMuscle: "ADDUCTORS", secondaryMuscles: ["QUADRICEPS", "GLUTES"], equipment: ["BARBELL", "DUMBBELL", "KETTLEBELLS"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Squat with a wide stance and toes turned out to emphasize the inner thighs.", descriptionFr: "Squat avec une position large et les pointes de pieds vers l'extérieur pour cibler les adducteurs.", introEn: "Sumo squats shift emphasis to the adductors and inner thighs.", introFr: "Le squat sumo déplace l'accent sur les adducteurs." },

  // ==================== ABDUCTORS ====================
  { nameEn: "Abductor Machine", nameFr: "Machine abducteurs", primaryMuscle: "ABDUCTORS", secondaryMuscles: ["GLUTES"], equipment: ["MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Sit in the abductor machine and push your legs apart against the resistance.", descriptionFr: "Asseyez-vous dans la machine abducteurs et écartez les jambes contre la résistance.", introEn: "The abductor machine isolates the outer thigh muscles.", introFr: "La machine abducteurs isole les muscles de l'extérieur des cuisses." },
  { nameEn: "Cable Hip Abduction", nameFr: "Abduction hanche câble", primaryMuscle: "ABDUCTORS", secondaryMuscles: ["GLUTES"], equipment: ["CABLE", "BANDS"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "With an ankle strap attached to a low cable, lift your leg out to the side.", descriptionFr: "Avec une sangle de cheville attachée à la poulie basse, levez la jambe sur le côté.", introEn: "Cable hip abductions target the gluteus medius and abductors.", introFr: "L'abduction hanche câble cible le moyen fessier et les abducteurs." },

  // ==================== NECK ====================
  { nameEn: "Neck Flexion", nameFr: "Flexion du cou", primaryMuscle: "NECK", equipment: ["BODY_ONLY", "WEIGHT_PLATE", "MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Lie face up and tuck your chin to your chest, or use a neck harness with weight.", descriptionFr: "Allongé face vers le haut, rentrez le menton vers la poitrine ou utilisez un harnais.", introEn: "Neck flexion strengthens the anterior neck muscles.", introFr: "La flexion du cou renforce les muscles antérieurs du cou." },
  { nameEn: "Neck Extension", nameFr: "Extension du cou", primaryMuscle: "NECK", equipment: ["BODY_ONLY", "WEIGHT_PLATE", "MACHINE"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Lie face down and lift your head backward against resistance.", descriptionFr: "Allongé face vers le bas, levez la tête vers l'arrière contre résistance.", introEn: "Neck extension strengthens the posterior neck muscles.", introFr: "L'extension du cou renforce les muscles postérieurs du cou." },

  // ==================== ROTATOR CUFF ====================
  { nameEn: "External Rotation", nameFr: "Rotation externe", primaryMuscle: "ROTATOR_CUFF", secondaryMuscles: ["SHOULDERS"], equipment: ["CABLE", "BANDS", "DUMBBELL"], mechanicsType: "ISOLATION", exerciseType: "STABILIZATION", descriptionEn: "With your elbow fixed at your side, rotate your forearm outward against resistance.", descriptionFr: "Le coude fixé au côté, tournez l'avant-bras vers l'extérieur contre résistance.", introEn: "External rotations strengthen the rotator cuff for shoulder health.", introFr: "La rotation externe renforce la coiffe des rotateurs." },
  { nameEn: "Internal Rotation", nameFr: "Rotation interne", primaryMuscle: "ROTATOR_CUFF", secondaryMuscles: ["SHOULDERS"], equipment: ["CABLE", "BANDS", "DUMBBELL"], mechanicsType: "ISOLATION", exerciseType: "STABILIZATION", descriptionEn: "With your elbow fixed at your side, rotate your forearm inward against resistance.", descriptionFr: "Le coude fixé au côté, tournez l'avant-bras vers l'intérieur contre résistance.", introEn: "Internal rotations strengthen the subscapularis for shoulder stability.", introFr: "La rotation interne renforce le sous-scapulaire." },

  // ==================== HIP FLEXOR ====================
  { nameEn: "Hanging Knee Raise", nameFr: "Relevé de genoux suspendu", primaryMuscle: "HIP_FLEXOR", secondaryMuscles: ["ABDOMINALS"], equipment: ["PULLUP_BAR"], mechanicsType: "ISOLATION", exerciseType: "BODYWEIGHT", descriptionEn: "Hang from a bar and raise your knees toward your chest.", descriptionFr: "Suspendu à une barre, levez les genoux vers la poitrine.", introEn: "Hanging knee raises target the hip flexors and lower abs.", introFr: "Le relevé de genoux suspendu cible les fléchisseurs de hanche." },
  { nameEn: "Cable Hip Flexion", nameFr: "Flexion hanche câble", primaryMuscle: "HIP_FLEXOR", equipment: ["CABLE", "BANDS"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "With an ankle strap, drive your knee up toward your chest against cable resistance.", descriptionFr: "Avec une sangle de cheville, montez le genou vers la poitrine contre la résistance du câble.", introEn: "Cable hip flexions strengthen the iliopsoas directly.", introFr: "La flexion hanche câble renforce l'ilio-psoas directement." },

  // ==================== FULL BODY ====================
  { nameEn: "Burpee", nameFr: "Burpee", primaryMuscle: "FULL_BODY", secondaryMuscles: ["CHEST", "ABDOMINALS", "QUADRICEPS"], equipment: ["BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "CARDIO", descriptionEn: "From standing, squat down, kick back to plank, do a push-up, hop forward, then jump up.", descriptionFr: "Debout, descendez en squat, jetez les pieds en arrière, faites une pompe, ramenez les pieds, sautez.", introEn: "Burpees are the ultimate full-body conditioning exercise.", introFr: "Les burpees sont l'exercice de conditionnement complet par excellence." },
  { nameEn: "Thruster", nameFr: "Thruster", primaryMuscle: "FULL_BODY", secondaryMuscles: ["QUADRICEPS", "SHOULDERS"], equipment: ["BARBELL", "DUMBBELL"], mechanicsType: "COMPOUND", exerciseType: "CROSSFIT", descriptionEn: "Front squat the weight and press it overhead in one fluid motion.", descriptionFr: "Faites un squat avant et pressez le poids au-dessus de la tête en un seul mouvement fluide.", introEn: "Thrusters are a full-body power exercise popular in CrossFit.", introFr: "Le thruster est un exercice de puissance complet populaire en CrossFit." },
  { nameEn: "Clean and Press", nameFr: "Épaulé-jeté", primaryMuscle: "FULL_BODY", secondaryMuscles: ["SHOULDERS", "BACK", "QUADRICEPS"], equipment: ["BARBELL", "DUMBBELL", "KETTLEBELLS"], mechanicsType: "COMPOUND", exerciseType: "WEIGHTLIFTING", descriptionEn: "Lift the weight from the floor to your shoulders (clean), then press it overhead (press).", descriptionFr: "Levez le poids du sol aux épaules (épaulé), puis pressez-le au-dessus de la tête (jeté).", introEn: "The clean and press is a classic full-body power exercise.", introFr: "L'épaulé-jeté est un exercice classique de puissance complète." },
  { nameEn: "Snatch", nameFr: "Arraché", primaryMuscle: "FULL_BODY", secondaryMuscles: ["SHOULDERS", "BACK", "GLUTES"], equipment: ["BARBELL", "DUMBBELL", "KETTLEBELLS"], mechanicsType: "COMPOUND", exerciseType: "WEIGHTLIFTING", descriptionEn: "Lift the weight from the floor to overhead in one explosive motion.", descriptionFr: "Levez le poids du sol au-dessus de la tête en un mouvement explosif.", introEn: "The snatch is the most technical lift in weightlifting.", introFr: "L'arraché est le mouvement le plus technique en haltérophilie." },
  { nameEn: "Turkish Get-Up", nameFr: "Levée turque", primaryMuscle: "FULL_BODY", secondaryMuscles: ["SHOULDERS", "ABDOMINALS", "GLUTES"], equipment: ["KETTLEBELLS", "DUMBBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "From lying on the floor holding a weight overhead, stand up while keeping the weight locked out.", descriptionFr: "Depuis le sol en tenant un poids au-dessus de la tête, levez-vous en gardant le poids verrouillé.", introEn: "The Turkish get-up builds total body stability and mobility.", introFr: "La levée turque développe la stabilité et la mobilité de tout le corps." },
  { nameEn: "Man Maker", nameFr: "Man Maker", primaryMuscle: "FULL_BODY", secondaryMuscles: ["CHEST", "BACK", "QUADRICEPS"], equipment: ["DUMBBELL"], mechanicsType: "COMPOUND", exerciseType: "CROSSFIT", descriptionEn: "A complex of push-up, row, clean, and thruster with dumbbells.", descriptionFr: "Un complexe de pompe, tirage, épaulé et thruster avec haltères.", introEn: "Man makers are an intense full-body conditioning exercise.", introFr: "Les man makers sont un exercice intense de conditionnement complet." },
  { nameEn: "Box Jump", nameFr: "Saut sur boîte", primaryMuscle: "FULL_BODY", secondaryMuscles: ["QUADRICEPS", "GLUTES", "CALVES"], equipment: ["BOX", "BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "PLYOMETRICS", descriptionEn: "Stand in front of a box and explosively jump up onto it, landing softly.", descriptionFr: "Debout devant une boîte, sautez explosivement dessus en atterrissant doucement.", introEn: "Box jumps develop explosive lower body power.", introFr: "Les sauts sur boîte développent la puissance explosive du bas du corps." },
  { nameEn: "Battle Ropes", nameFr: "Corde de combat", primaryMuscle: "FULL_BODY", secondaryMuscles: ["SHOULDERS", "ABDOMINALS"], equipment: ["ROPES"], mechanicsType: "COMPOUND", exerciseType: "CARDIO", descriptionEn: "Create alternating waves with heavy ropes for a full-body cardio and strength workout.", descriptionFr: "Créez des vagues alternées avec des cordes lourdes pour un entraînement cardio et force complet.", introEn: "Battle ropes are a high-intensity full-body conditioning tool.", introFr: "Les cordes de combat sont un outil de conditionnement complet à haute intensité." },
  { nameEn: "Sled Push", nameFr: "Poussée de traîne", primaryMuscle: "FULL_BODY", secondaryMuscles: ["QUADRICEPS", "GLUTES", "CALVES"], equipment: ["SLED"], mechanicsType: "COMPOUND", exerciseType: "STRONGMAN", descriptionEn: "Push a weighted sled forward for distance or time.", descriptionFr: "Poussez un traîne chargé vers l'avant sur une distance ou un temps donné.", introEn: "Sled pushes build incredible conditioning and leg power.", introFr: "La poussée de traîne développe un conditionnement et une puissance incroyables." },
  { nameEn: "Rowing Machine", nameFr: "Rameur", primaryMuscle: "FULL_BODY", secondaryMuscles: ["BACK", "QUADRICEPS", "BICEPS"], equipment: ["MACHINE"], mechanicsType: "COMPOUND", exerciseType: "CARDIO", descriptionEn: "Use the rowing machine with proper form for a full-body cardiovascular workout.", descriptionFr: "Utilisez le rameur avec une bonne technique pour un entraînement cardio complet.", introEn: "Rowing is one of the most effective full-body cardio exercises.", introFr: "L'aviron est l'un des exercices cardio les plus efficaces." },

  // ==================== STRETCHING ====================
  { nameEn: "Standing Hamstring Stretch", nameFr: "Étirement ischio-jambiers debout", primaryMuscle: "HAMSTRINGS", equipment: ["BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "STRETCHING", descriptionEn: "Stand and bend forward at the hips, reaching toward your toes to stretch the hamstrings.", descriptionFr: "Debout, penchez-vous aux hanches en atteignant vos orteils pour étirer les ischio-jambiers.", introEn: "Hamstring stretches improve flexibility and prevent injuries.", introFr: "L'étirement des ischio-jambiers améliore la souplesse et prévient les blessures." },
  { nameEn: "Chest Stretch", nameFr: "Étirement pectoraux", primaryMuscle: "CHEST", equipment: ["BODY_ONLY", "WALL"], mechanicsType: "ISOLATION", exerciseType: "STRETCHING", descriptionEn: "Place your forearm against a wall and turn away to stretch the chest and front shoulder.", descriptionFr: "Placez l'avant-bras contre un mur et tournez-vous pour étirer les pectoraux et l'avant de l'épaule.", introEn: "Chest stretches counteract the effects of sitting and desk work.", introFr: "L'étirement des pectoraux compense les effets de la position assise." },
  { nameEn: "Hip Flexor Stretch", nameFr: "Étirement fléchisseur de hanche", primaryMuscle: "HIP_FLEXOR", equipment: ["BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "STRETCHING", descriptionEn: "In a lunge position, push your hips forward to stretch the hip flexors of the back leg.", descriptionFr: "En position de fente, poussez les hanches vers l'avant pour étirer les fléchisseurs de hanche.", introEn: "Hip flexor stretches are essential for those who sit for long periods.", introFr: "L'étirement des fléchisseurs de hanche est essentiel pour les personnes assises longtemps." },
  { nameEn: "Lat Stretch", nameFr: "Étirement grand dorsal", primaryMuscle: "LATS", equipment: ["BODY_ONLY", "WALL"], mechanicsType: "ISOLATION", exerciseType: "STRETCHING", descriptionEn: "Reach overhead and lean to one side to stretch the lat on the opposite side.", descriptionFr: "Levez les bras et penchez-vous d'un côté pour étirer le grand dorsal du côté opposé.", introEn: "Lat stretches improve overhead mobility.", introFr: "L'étirement des dorsaux améliore la mobilité au-dessus de la tête." },
  { nameEn: "Quad Stretch", nameFr: "Étirement quadriceps", primaryMuscle: "QUADRICEPS", equipment: ["BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "STRETCHING", descriptionEn: "Stand on one leg and pull your other heel toward your glute to stretch the quad.", descriptionFr: "Debout sur une jambe, tirez le talon vers la fesse pour étirer le quadriceps.", introEn: "Quad stretches are essential post-workout for recovery.", introFr: "L'étirement des quadriceps est essentiel après l'entraînement." },
  { nameEn: "Shoulder Stretch", nameFr: "Étirement épaules", primaryMuscle: "SHOULDERS", equipment: ["BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "STRETCHING", descriptionEn: "Pull one arm across your chest and hold to stretch the rear deltoid and shoulder.", descriptionFr: "Tirez un bras devant la poitrine et maintenez pour étirer le deltoïde arrière.", introEn: "Shoulder stretches maintain mobility and prevent injury.", introFr: "L'étirement des épaules maintient la mobilité et prévient les blessures." },
  { nameEn: "Foam Roll Back", nameFr: "Rouleau dos", primaryMuscle: "BACK", equipment: ["FOAM_ROLL"], mechanicsType: "ISOLATION", exerciseType: "STRETCHING", descriptionEn: "Lie on a foam roller and roll along your upper and mid back to release tension.", descriptionFr: "Allongé sur un rouleau de mousse, roulez le long du haut et du milieu du dos.", introEn: "Foam rolling releases muscle tension and improves recovery.", introFr: "Le rouleau de mousse relâche les tensions et améliore la récupération." },
  { nameEn: "Foam Roll IT Band", nameFr: "Rouleau bande IT", primaryMuscle: "ABDUCTORS", secondaryMuscles: ["QUADRICEPS"], equipment: ["FOAM_ROLL"], mechanicsType: "ISOLATION", exerciseType: "STRETCHING", descriptionEn: "Lie on your side with the foam roller under your outer thigh and roll from hip to knee.", descriptionFr: "Allongé sur le côté avec le rouleau sous la cuisse externe, roulez de la hanche au genou.", introEn: "IT band foam rolling helps prevent knee pain and improves mobility.", introFr: "Le rouleau sur la bande IT prévient les douleurs au genou." },
  { nameEn: "Foam Roll Calves", nameFr: "Rouleau mollets", primaryMuscle: "CALVES", equipment: ["FOAM_ROLL"], mechanicsType: "ISOLATION", exerciseType: "STRETCHING", descriptionEn: "Sit with the foam roller under your calves and roll from ankle to knee.", descriptionFr: "Asseyez-vous avec le rouleau sous les mollets et roulez de la cheville au genou.", introEn: "Calf foam rolling improves ankle mobility and reduces soreness.", introFr: "Le rouleau sur les mollets améliore la mobilité de la cheville." },

  // ==================== STABILIZATION ====================
  { nameEn: "Pallof Press", nameFr: "Press Pallof", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["OBLIQUES"], equipment: ["CABLE", "BANDS"], mechanicsType: "ISOLATION", exerciseType: "STABILIZATION", descriptionEn: "Stand sideways to a cable and press the handle out in front of you, resisting rotation.", descriptionFr: "Debout de côté par rapport à une poulie, pressez la poignée devant vous en résistant à la rotation.", introEn: "Pallof presses build anti-rotation core stability.", introFr: "Le press Pallof développe la stabilité anti-rotation du tronc." },
  { nameEn: "Bird Dog", nameFr: "Oiseau-chien", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["BACK", "GLUTES"], equipment: ["BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "STABILIZATION", descriptionEn: "On all fours, extend opposite arm and leg while keeping your spine neutral.", descriptionFr: "À quatre pattes, étendez le bras et la jambe opposés en gardant la colonne neutre.", introEn: "Bird dogs build core stability and coordination.", introFr: "L'oiseau-chien développe la stabilité et la coordination du tronc." },
  { nameEn: "Single-Leg Balance", nameFr: "Équilibre une jambe", primaryMuscle: "GLUTES", secondaryMuscles: ["ABDOMINALS", "CALVES"], equipment: ["BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "STABILIZATION", descriptionEn: "Stand on one leg and maintain your balance for time, optionally closing your eyes.", descriptionFr: "Tenez-vous sur une jambe et maintenez l'équilibre, en option les yeux fermés.", introEn: "Single-leg balance improves proprioception and stability.", introFr: "L'équilibre sur une jambe améliore la proprioception et la stabilité." },

  // ==================== DESK / OFFICE ====================
  { nameEn: "Seated Shoulder Shrug", nameFr: "Haussement d'épaules assis", primaryMuscle: "TRAPS", secondaryMuscles: ["SHOULDERS"], equipment: ["DESK", "BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "STRETCHING", descriptionEn: "While seated at your desk, shrug your shoulders up and hold, then release.", descriptionFr: "Assis à votre bureau, haussez les épaules et maintenez, puis relâchez.", introEn: "Desk shoulder shrugs relieve tension from sitting.", introFr: "Les haussements d'épaules au bureau soulagent la tension de la position assise." },
  { nameEn: "Seated Spinal Twist", nameFr: "Torsion vertébrale assise", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["OBLIQUES", "BACK"], equipment: ["DESK", "BODY_ONLY"], mechanicsType: "ISOLATION", exerciseType: "STRETCHING", descriptionEn: "While seated, twist your torso to one side and hold, then switch sides.", descriptionFr: "Assis, tournez le buste d'un côté et maintenez, puis changez de côté.", introEn: "Seated spinal twists relieve back stiffness from sitting.", introFr: "La torsion vertébrale assise soulage la raideur du dos." },

  // ==================== TRX ====================
  { nameEn: "TRX Row", nameFr: "Tirage TRX", primaryMuscle: "BACK", secondaryMuscles: ["LATS", "BICEPS"], equipment: ["TRX"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Hold the TRX handles and lean back, then pull your chest toward the handles.", descriptionFr: "Tenez les poignées TRX et penchez-vous en arrière, puis tirez votre poitrine vers les poignées.", introEn: "TRX rows are a scalable back exercise for all levels.", introFr: "Le tirage TRX est un exercice de dos adaptable à tous les niveaux." },
  { nameEn: "TRX Chest Press", nameFr: "Développé TRX", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS", "SHOULDERS"], equipment: ["TRX"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Hold the TRX handles and lean forward, then press back up to the starting position.", descriptionFr: "Tenez les poignées TRX et penchez-vous en avant, puis poussez pour revenir.", introEn: "TRX chest presses build chest strength with core stability.", introFr: "Le développé TRX développe la force des pectoraux avec stabilité du tronc." },
  { nameEn: "TRX Bicep Curl", nameFr: "Curl biceps TRX", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: ["TRX"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Face the anchor, hold the handles with underhand grip and curl your body toward the handles.", descriptionFr: "Face au point d'ancrage, tenez les poignées en supination et curl le corps vers les poignées.", introEn: "TRX curls use body weight for bicep training.", introFr: "Le curl TRX utilise le poids du corps pour les biceps." },
  { nameEn: "TRX Tricep Press", nameFr: "Extension triceps TRX", primaryMuscle: "TRICEPS", equipment: ["TRX"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Face away from the anchor, press your body away from the handles by extending your elbows.", descriptionFr: "Dos au point d'ancrage, poussez votre corps en étendant les coudes.", introEn: "TRX tricep presses isolate the triceps using body weight.", introFr: "L'extension triceps TRX isole les triceps avec le poids du corps." },
  { nameEn: "TRX Pistol Squat", nameFr: "Squat pistol TRX", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES"], equipment: ["TRX"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Hold the TRX handles and perform a single-leg squat, using the straps for assistance.", descriptionFr: "Tenez les poignées TRX et effectuez un squat une jambe, en utilisant les sangles comme aide.", introEn: "TRX pistol squats make single-leg training accessible.", introFr: "Le squat pistol TRX rend l'entraînement unilatéral accessible." },

  // ==================== MEDICINE BALL ====================
  { nameEn: "Medicine Ball Slam", nameFr: "Slam médecine-ball", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["BACK", "SHOULDERS"], equipment: ["MEDICINE_BALL"], mechanicsType: "COMPOUND", exerciseType: "POWER", descriptionEn: "Raise the medicine ball overhead and slam it to the ground with maximum force.", descriptionFr: "Levez le médecine-ball au-dessus de la tête et frappez-le au sol avec force maximale.", introEn: "Med ball slams build explosive core power.", introFr: "Le slam médecine-ball développe la puissance explosive du tronc." },
  { nameEn: "Medicine Ball Wall Ball", nameFr: "Wall ball médecine-ball", primaryMuscle: "FULL_BODY", secondaryMuscles: ["QUADRICEPS", "SHOULDERS"], equipment: ["MEDICINE_BALL", "WALL"], mechanicsType: "COMPOUND", exerciseType: "CROSSFIT", descriptionEn: "Squat down and throw the medicine ball to a target on the wall, catch and repeat.", descriptionFr: "Descendez en squat et lancez le médecine-ball vers une cible sur le mur, rattrapez et répétez.", introEn: "Wall balls are a staple CrossFit conditioning exercise.", introFr: "Le wall ball est un exercice de conditionnement classique en CrossFit." },
  { nameEn: "Medicine Ball Russian Twist", nameFr: "Twist russe médecine-ball", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["OBLIQUES"], equipment: ["MEDICINE_BALL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Sit with the medicine ball and twist from side to side, touching the ball to the floor.", descriptionFr: "Asseyez-vous avec le médecine-ball et tournez de gauche à droite en touchant le sol.", introEn: "Med ball Russian twists add resistance to oblique training.", introFr: "Le twist russe médecine-ball ajoute de la résistance au travail des obliques." },

  // ==================== RESISTANCE BANDS ====================
  { nameEn: "Band Pull-Apart", nameFr: "Écartage élastique", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRAPS"], equipment: ["BANDS"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Hold a band in front of you and pull it apart, squeezing your shoulder blades together.", descriptionFr: "Tenez un élastique devant vous et écartez-le en serrant les omoplates.", introEn: "Band pull-aparts improve posture and shoulder health.", introFr: "L'écartage élastique améliore la posture et la santé des épaules." },
  { nameEn: "Band Chest Press", nameFr: "Développé élastique", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS"], equipment: ["BANDS"], mechanicsType: "COMPOUND", exerciseType: "RESISTANCE", descriptionEn: "Wrap the band around your back and press forward like a bench press motion.", descriptionFr: "Enroulez l'élastique dans le dos et pressez vers l'avant comme un développé couché.", introEn: "Band chest presses provide portable chest training.", introFr: "Le développé élastique offre un entraînement pectoral portable." },
  { nameEn: "Band Curl", nameFr: "Curl élastique", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: ["BANDS"], mechanicsType: "ISOLATION", exerciseType: "RESISTANCE", descriptionEn: "Step on the band and curl it up by bending your elbows.", descriptionFr: "Marchez sur l'élastique et curl-le en fléchissant les coudes.", introEn: "Band curls provide variable resistance for bicep training.", introFr: "Le curl élastique offre une résistance variable pour les biceps." },

  // ==================== SANDBAG ====================
  { nameEn: "Sandbag Clean", nameFr: "Épaulé sandbag", primaryMuscle: "FULL_BODY", secondaryMuscles: ["BACK", "GLUTES", "SHOULDERS"], equipment: ["SANDBAG"], mechanicsType: "COMPOUND", exerciseType: "STRONGMAN", descriptionEn: "Lift the sandbag from the floor to your shoulders in one powerful motion.", descriptionFr: "Levez le sandbag du sol aux épaules en un mouvement puissant.", introEn: "Sandbag cleans build functional full-body strength.", introFr: "L'épaulé sandbag développe la force fonctionnelle." },
  { nameEn: "Sandbag Carry", nameFr: "Porté sandbag", primaryMuscle: "FULL_BODY", secondaryMuscles: ["TRAPS", "GLUTES"], equipment: ["SANDBAG"], mechanicsType: "COMPOUND", exerciseType: "STRONGMAN", descriptionEn: "Carry the sandbag in various positions (shoulder, bear hug, Zercher) for distance.", descriptionFr: "Portez le sandbag dans différentes positions pour une distance donnée.", introEn: "Sandbag carries build real-world strength and conditioning.", introFr: "Le porté sandbag développe la force et le conditionnement." },

  // ==================== STABILITY BALL ====================
  { nameEn: "Stability Ball Crunch", nameFr: "Crunch ball suisse", primaryMuscle: "ABDOMINALS", equipment: ["SWISS_BALL"], mechanicsType: "ISOLATION", exerciseType: "STRENGTH", descriptionEn: "Lie back on a Swiss ball and curl up into a crunch, using the ball for a greater range of motion.", descriptionFr: "Allongé sur un ballon suisse, effectuez un crunch en utilisant le ballon pour une plus grande amplitude.", introEn: "Stability ball crunches increase the range of motion compared to floor crunches.", introFr: "Le crunch ball suisse augmente l'amplitude par rapport aux crunchs au sol." },
  { nameEn: "Stability Ball Rollout", nameFr: "Roulement ballon suisse", primaryMuscle: "ABDOMINALS", secondaryMuscles: ["SHOULDERS"], equipment: ["SWISS_BALL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Kneel with your forearms on the ball and roll it forward, then pull back using your core.", descriptionFr: "À genoux avec les avant-bras sur le ballon, roulez vers l'avant puis tirez pour revenir.", introEn: "Stability ball rollouts are an effective core exercise.", introFr: "Le roulement ballon suisse est un exercice efficace pour le tronc." },
  { nameEn: "Stability Ball Push-Up", nameFr: "Pompe ballon suisse", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS", "ABDOMINALS"], equipment: ["SWISS_BALL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Perform push-ups with your hands on a Swiss ball for added instability.", descriptionFr: "Effectuez des pompes avec les mains sur un ballon suisse pour plus d'instabilité.", introEn: "Swiss ball push-ups challenge stability and core engagement.", introFr: "Les pompes ballon suisse stimulent la stabilité et l'engagement du tronc." },

  // ==================== STEP ====================
  { nameEn: "Step-Up with Step", nameFr: "Montée sur step", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES"], equipment: ["STEP", "DUMBBELL", "BARBELL"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Step up onto an aerobic step platform, driving through your front leg.", descriptionFr: "Montez sur un step aérobic en poussant avec la jambe avant.", introEn: "Step-ups on a step platform are great for unilateral leg training.", introFr: "Les montées sur step sont excellentes pour l'entraînement unilatéral." },

  // ==================== BOSU ====================
  { nameEn: "BOSU Squat", nameFr: "Squat BOSU", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES", "ABDOMINALS"], equipment: ["BOSU"], mechanicsType: "COMPOUND", exerciseType: "STABILIZATION", descriptionEn: "Stand on the BOSU ball side and perform squats while maintaining balance.", descriptionFr: "Debout sur le côté ballon du BOSU, effectuez des squats en maintenant l'équilibre.", introEn: "BOSU squats challenge balance and proprioception.", introFr: "Le squat BOSU stimule l'équilibre et la proprioception." },

  // ==================== TYRE ====================
  { nameEn: "Tyre Flip", nameFr: "Retournement de pneu", primaryMuscle: "FULL_BODY", secondaryMuscles: ["BACK", "GLUTES", "SHOULDERS"], equipment: ["TYRE"], mechanicsType: "COMPOUND", exerciseType: "STRONGMAN", descriptionEn: "Lift and flip a large tyre by driving your hips and pushing the tyre over.", descriptionFr: "Soulevez et retournez un grand pneu en poussant avec les hanches.", introEn: "Tyre flips build incredible full-body power.", introFr: "Le retournement de pneu développe une puissance incroyable." },

  // ==================== SKIERG ====================
  { nameEn: " SkiErg", nameFr: "SkiErg", primaryMuscle: "BACK", secondaryMuscles: ["SHOULDERS", "ABDOMINALS"], equipment: ["SKIERG"], mechanicsType: "COMPOUND", exerciseType: "CARDIO", descriptionEn: "Pull the handles down in a double-poling motion like cross-country skiing.", descriptionFr: "Tirez les poignées vers le bas dans un mouvement de double poussée comme en ski de fond.", introEn: "The SkiErg provides a high-intensity upper body cardio workout.", introFr: "Le SkiErg offre un entraînement cardio intense pour le haut du corps." },

  // ==================== WEIGHT PLATE ====================
  { nameEn: "Plate Press", nameFr: "Press disque", primaryMuscle: "CHEST", secondaryMuscles: ["SHOULDERS", "TRICEPS"], equipment: ["WEIGHT_PLATE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Hold a weight plate at chest level and press it out in front of you, then pull it back.", descriptionFr: "Tenez un disque au niveau de la poitrine et pressez-le devant vous, puis tirez-le vers vous.", introEn: "Plate presses are a unique pressing variation.", introFr: "Le press disque est une variante de pressage unique." },

  // ==================== CHAIN ====================
  { nameEn: "Chain Squat", nameFr: "Squat chaînes", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["GLUTES", "HAMSTRINGS"], equipment: ["BARBELL", "CHAIN"], mechanicsType: "COMPOUND", exerciseType: "POWERLIFTING", descriptionEn: "Perform squats with chains attached to the bar for accommodating resistance.", descriptionFr: "Effectuez des squats avec des chaînes attachées à la barre pour une résistance accommodante.", introEn: "Chain squats provide variable resistance throughout the lift.", introFr: "Le squat chaînes offre une résistance variable." },

  // ==================== POLE ====================
  { nameEn: "Pole Climb", nameFr: "Grimpée à la perche", primaryMuscle: "FULL_BODY", secondaryMuscles: ["BACK", "BICEPS", "ABDOMINALS"], equipment: ["POLE"], mechanicsType: "COMPOUND", exerciseType: "STRENGTH", descriptionEn: "Climb a pole using upper body and core strength.", descriptionFr: "Grimpez à une perche en utilisant la force du haut du corps et du tronc.", introEn: "Pole climbing builds grip, back, and core strength.", introFr: "La grimpée à la perche développe la préhension, le dos et le tronc." },

  // ==================== CAR ====================
  { nameEn: "Car Push", nameFr: "Poussée de voiture", primaryMuscle: "FULL_BODY", secondaryMuscles: ["QUADRICEPS", "GLUTES", "CALVES"], equipment: ["CAR"], mechanicsType: "COMPOUND", exerciseType: "STRONGMAN", descriptionEn: "Push a car in neutral for distance, driving through your legs.", descriptionFr: "Poussez une voiture au point mort sur une distance, en poussant avec les jambes.", introEn: "Car pushes are the ultimate strongman conditioning exercise.", introFr: "La poussée de voiture est l'exercice de conditionnement strongman par excellence." },

  // ==================== CAR (additional strongman) ====================
  { nameEn: "Log Press", nameFr: "Pressé bûche", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRICEPS", "TRAPS"], equipment: ["BARBELL"], mechanicsType: "COMPOUND", exerciseType: "STRONGMAN", descriptionEn: "Clean a log bar to your chest and press it overhead, mimicking the strongman event.", descriptionFr: "Épaulez une bûche et pressez-la au-dessus de la tête.", introEn: "The log press is a strongman staple for overhead power.", introFr: "Le pressé bûche est un classique strongman." },

  // ==================== ROPES (jump rope) ====================
  { nameEn: "Jump Rope", nameFr: "Corde à sauter", primaryMuscle: "CALVES", secondaryMuscles: ["SHOULDERS", "FULL_BODY"], equipment: ["ROPES", "BODY_ONLY"], mechanicsType: "COMPOUND", exerciseType: "CARDIO", descriptionEn: "Swing a jump rope and hop over it for a cardiovascular workout.", descriptionFr: "Faites tourner une corde à sauter et sautez par-dessus pour un entraînement cardio.", introEn: "Jump rope is one of the best cardio exercises for coordination and endurance.", introFr: "La corde à sauter est l'un des meilleurs exercices cardio." },

  // ==================== SPIN BIKE ====================
  { nameEn: "Spin Bike Sprint", nameFr: "Sprint vélo stationnaire", primaryMuscle: "QUADRICEPS", secondaryMuscles: ["HAMSTRINGS", "CALVES"], equipment: ["SPIN_BIKE"], mechanicsType: "COMPOUND", exerciseType: "CARDIO", descriptionEn: "Pedal at maximum intensity for intervals on a spin bike.", descriptionFr: "Pédalez à intensité maximale par intervalles sur un vélo stationnaire.", introEn: "Spin bike sprints build cardiovascular fitness and leg power.", introFr: "Les sprints vélo développent la condition cardiovasculaire." },
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
      logs.push(`  ${name}: ${values.length} values`);
    }

    const nameCount = await prisma.exerciseAttributeName.count();
    const valueCount = await prisma.exerciseAttributeValue.count();
    logs.push(`Attribute taxonomy done: ${nameCount} names, ${valueCount} values`);

    // Step 2: Expand templates → one exercise per equipment type
    logs.push("\nStep 2: Expanding exercise templates...");
    const expandedExercises: {
      name: string; nameEn: string; description: string; descriptionEn: string;
      fullVideoUrl: string | null; fullVideoImageUrl: string | null;
      introduction: string; introductionEn: string;
      slug: string; slugEn: string;
      attributes: { attributeName: string; attributeValue: string }[];
    }[] = [];

    for (const template of exerciseTemplates) {
      for (const equip of template.equipment) {
        const equipLabel = equip.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        const equipLabelFr = equip === "BODY_ONLY" ? "poids du corps" :
          equip === "PULLUP_BAR" ? "barre de traction" :
          equip === "CABLE" ? "câble" :
          equip === "DUMBBELL" ? "haltères" :
          equip === "BARBELL" ? "barre" :
          equip === "MACHINE" ? "machine" :
          equip === "SMITH_MACHINE" ? "Smith" :
          equip === "EZ_BAR" ? "barre EZ" :
          equip === "KETTLEBELLS" ? "kettlebell" :
          equip === "BANDS" ? "élastique" :
          equip === "BENCH" ? "banc" :
          equip === "BOX" ? "box" :
          equip === "MEDICINE_BALL" ? "médecine-ball" :
          equip === "SWISS_BALL" ? "ballon suisse" :
          equip === "WEIGHT_PLATE" ? "disque" :
          equip === "TRX" ? "TRX" :
          equip === "FOAM_ROLL" ? "rouleau" :
          equip === "WALL" ? "mur" :
          equip === "BOSU" ? "BOSU" :
          equip === "STEP" ? "step" :
          equip === "TYRE" ? "pneu" :
          equip === "SANDBAG" ? "sandbag" :
          equip === "SLED" ? "traîne" :
          equip === "ROPES" ? "cordes" :
          equip === "SPIN_BIKE" ? "vélo" :
          equip === "PULLUP_BAR" ? "barre" :
          equip === "RACK" ? "rack" :
          equip === "DESK" ? "bureau" :
          equip === "POLE" ? "perche" :
          equip === "CAR" ? "voiture" :
          equip === "SKIERG" ? "SkiErg" :
          equip === "CHAIN" ? "chaînes" :
          equip === "ROPE" ? "corde" :
          equip;

        const suffixEn = template.equipment.length > 1 ? ` (${equipLabel})` : "";
        const suffixFr = template.equipment.length > 1 ? ` (${equipLabelFr})` : "";

        const nameEn = `${template.nameEn}${suffixEn}`;
        const nameFr = `${template.nameFr}${suffixFr}`;
        const slugBase = toSlug(template.nameEn);
        const slugFrBase = toSlugFr(template.nameFr);
        const slugSuffix = template.equipment.length > 1 ? `-${toSlug(equip)}` : "";

        expandedExercises.push({
          name: nameFr,
          nameEn: nameEn,
          description: template.descriptionFr,
          descriptionEn: template.descriptionEn,
          fullVideoUrl: null,
          fullVideoImageUrl: null,
          introduction: template.introFr,
          introductionEn: template.introEn,
          slug: `${slugBase}${slugSuffix}`,
          slugEn: `${slugBase}${slugSuffix}`,
          attributes: [
            { attributeName: "TYPE", attributeValue: template.exerciseType },
            { attributeName: "PRIMARY_MUSCLE", attributeValue: template.primaryMuscle },
            ...(template.secondaryMuscles || []).map(m => ({ attributeName: "SECONDARY_MUSCLE", attributeValue: m })),
            { attributeName: "EQUIPMENT", attributeValue: equip },
            { attributeName: "MECHANICS_TYPE", attributeValue: template.mechanicsType },
          ],
        });
      }
    }

    logs.push(`Expanded ${exerciseTemplates.length} templates into ${expandedExercises.length} exercises`);

    // Step 3: Insert exercises
    logs.push("\nStep 3: Inserting exercises...");
    let imported = 0;
    let errors = 0;

    for (const exercise of expandedExercises) {
      try {
        const createdExercise = await prisma.exercise.upsert({
          where: { slug: exercise.slug },
          update: {
            name: exercise.name,
            nameEn: exercise.nameEn,
            description: exercise.description,
            descriptionEn: exercise.descriptionEn,
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

        await prisma.exerciseAttribute.deleteMany({
          where: { exerciseId: createdExercise.id },
        });

        for (const attr of exercise.attributes) {
          try {
            const attributeName = await prisma.exerciseAttributeName.findUnique({
              where: { name: attr.attributeName as ExerciseAttributeNameEnum },
            });
            if (!attributeName) continue;

            const normalizedValue = normalizeAttributeValue(attr.attributeValue);
            const attributeValue = await prisma.exerciseAttributeValue.findFirst({
              where: { attributeNameId: attributeName.id, value: normalizedValue },
            });
            if (!attributeValue) continue;

            await prisma.exerciseAttribute.create({
              data: {
                exerciseId: createdExercise.id,
                attributeNameId: attributeName.id,
                attributeValueId: attributeValue.id,
              },
            });
          } catch {
            // Skip duplicate attributes
          }
        }

        imported++;
        if (imported % 50 === 0) {
          logs.push(`  Progress: ${imported}/${expandedExercises.length}`);
        }
      } catch (error) {
        errors++;
        if (errors <= 5) {
          logs.push(`  Error: ${exercise.nameEn} - ${error}`);
        }
      }
    }

    logs.push(`Template exercises: Imported ${imported}, Errors ${errors}`);

    // Step 4: Insert CSV-sourced exercises
    logs.push("\nStep 4: Inserting CSV-sourced exercises...");
    let csvImported = 0;
    let csvErrors = 0;

    for (const exercise of csvExercises) {
      try {
        const slug = exercise.slug || toSlug(exercise.nameEn || exercise.name);
        const slugEn = exercise.slugEn || toSlug(exercise.nameEn || exercise.name);

        const createdExercise = await prisma.exercise.upsert({
          where: { slug },
          update: {
            name: exercise.name,
            nameEn: exercise.nameEn,
            description: exercise.description,
            descriptionEn: exercise.descriptionEn,
            fullVideoUrl: exercise.fullVideoUrl,
            fullVideoImageUrl: exercise.fullVideoImageUrl,
            introduction: exercise.introduction,
            introductionEn: exercise.introductionEn,
            slugEn,
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
            slug,
            slugEn,
          },
        });

        // Remove old attributes for this exercise
        await prisma.exerciseAttribute.deleteMany({
          where: { exerciseId: createdExercise.id },
        });

        // Create new attributes
        for (const attr of exercise.attributes) {
          try {
            const attributeName = await prisma.exerciseAttributeName.findUnique({
              where: { name: attr.attributeName as ExerciseAttributeNameEnum },
            });
            if (!attributeName) continue;

            const normalizedValue = normalizeAttributeValue(attr.attributeValue);
            const attributeValue = await prisma.exerciseAttributeValue.findFirst({
              where: { attributeNameId: attributeName.id, value: normalizedValue },
            });
            if (!attributeValue) continue;

            await prisma.exerciseAttribute.create({
              data: {
                exerciseId: createdExercise.id,
                attributeNameId: attributeName.id,
                attributeValueId: attributeValue.id,
              },
            });
          } catch {
            // Skip duplicate attributes
          }
        }

        csvImported++;
        logs.push(`  CSV: ${exercise.nameEn || exercise.name}`);
      } catch (error) {
        csvErrors++;
        logs.push(`  CSV Error: ${exercise.nameEn || exercise.name} - ${error}`);
      }
    }

    const totalExercises = await prisma.exercise.count();
    const totalAttributes = await prisma.exerciseAttribute.count();

    logs.push(`\nDone! ${totalExercises} exercises, ${totalAttributes} attributes`);
    logs.push(`Template: Imported ${imported}, Errors ${errors}`);
    logs.push(`CSV: Imported ${csvImported}, Errors ${csvErrors}`);

    return NextResponse.json({
      status: "success",
      message: `Seeded ${totalExercises} exercises successfully!`,
      summary: { attributeNames: nameCount, attributeValues: valueCount, exercises: totalExercises, exerciseAttributes: totalAttributes, templateImported: imported, csvImported },
      logs,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error", logs }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
