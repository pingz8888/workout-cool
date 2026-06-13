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
// SAMPLE EXERCISES (from data/sample-exercises.csv)
// =============================================
interface ExerciseData {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  fullVideoUrl: string;
  fullVideoImageUrl: string;
  introduction: string;
  introductionEn: string;
  slug: string;
  slugEn: string;
  attributes: { attributeName: string; attributeValue: string }[];
}

const sampleExercises: ExerciseData[] = [
  {
    name: "Fentes arrières à la barre",
    nameEn: "Barbell Alternating Reverse Lunges",
    description: '<p>Tenez-vous droit en tenant une barre placée sur l\'arrière de vos épaules.</p><p>Faites un pas en arrière de 2 à 3 pieds avec un pied et abaissez votre corps au sol.</p><p>Votre genou arrière doit presque toucher le sol et votre genou avant doit être à un angle de 90 degrés.</p><p>Poussez vers le haut et revenez à la position de départ.</p><p>Répétez avec l\'autre jambe.</p><p>Répétez le mouvement pour le nombre recommandé de répétitions, puis effectuez avec l\'autre jambe.</p>',
    descriptionEn: '<p>Stand upright holding a barbell placed across the back of your shoulders.</p><p>Step back 2-3 feet with one foot and lower your body to the ground.</p><p>Your back knee should almost touch the ground and your front knee should be at a 90-degree angle.</p><p>Push up to return to the starting position.</p><p>Repeat with the other leg.</p><p>Repeat the movement for the recommended number of repetitions, then switch to the other leg.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/NmfQzqGktgs?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/NmfQzqGktgs/hqdefault.jpg",
    introduction: '<p>Les <strong>fentes arrières à la barre</strong> sont un exercice efficace pour cibler les <strong>muscles des jambes</strong> et les <strong>fessiers</strong>. Idéal pour les sportifs intermédiaires à avancés, cet exercice aide à améliorer l\'<em>équilibre</em> et la <em>stabilité</em> tout en augmentant la <strong>force des jambes</strong>.</p>',
    introductionEn: '<p>The <strong>barbell alternating reverse lunges</strong> are an effective exercise to target the <strong>leg muscles</strong> and <strong>glutes</strong>. Ideal for intermediate to advanced athletes, this exercise helps improve <em>balance</em> and <em>stability</em> while increasing <strong>leg strength</strong>.</p>',
    slug: "fentes-arrieres-barre",
    slugEn: "barbell-alternating-reverse-lunges",
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
    name: "Développé militaire à la barre",
    nameEn: "Barbell Military Press",
    description: '<p>Tenez-vous droit en tenant une barre au niveau des épaules avec une prise plus large que les épaules.</p><p>Poussez la barre vers le haut au-dessus de votre tête en étendant complètement vos bras.</p><p>Abaissez lentement la barre vers la position de départ.</p><p>Répétez pour le nombre recommandé de répétitions.</p>',
    descriptionEn: '<p>Stand upright holding a barbell at shoulder level with a grip wider than shoulder width.</p><p>Push the barbell upward over your head by fully extending your arms.</p><p>Slowly lower the barbell back to the starting position.</p><p>Repeat for the recommended number of repetitions.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/yJkpRER2cGk?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/yJkpRER2cGk/hqdefault.jpg",
    introduction: '<p>Le <strong>développé militaire à la barre</strong> est un exercice fondamental pour les <strong>épaules</strong>. Il sollicite également les <strong>triceps</strong> et le <strong>haut du dos</strong>. Cet exercice est idéal pour développer la force et la masse musculaire des épaules.</p>',
    introductionEn: '<p>The <strong>barbell military press</strong> is a fundamental exercise for the <strong>shoulders</strong>. It also engages the <strong>triceps</strong> and <strong>upper back</strong>. This exercise is ideal for developing shoulder strength and muscle mass.</p>',
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
    name: "Tirage poitrine à la poulie",
    nameEn: "Cable Chest Fly",
    description: '<p>Placez les poulies en position haute et tenez une poignée dans chaque main.</p><p>Avancez d\'un pas entre les poulies et penchez-vous légèrement vers l\'avant.</p><p>Amenez vos mains ensemble devant vous en gardant les bras légèrement pliés.</p><p>Revenez lentement à la position de départ en contrôlant le mouvement.</p><p>Répétez pour le nombre recommandé de répétitions.</p>',
    descriptionEn: '<p>Set the pulleys to the high position and hold a handle in each hand.</p><p>Step forward between the pulleys and lean slightly forward.</p><p>Bring your hands together in front of you while keeping your arms slightly bent.</p><p>Slowly return to the starting position while controlling the movement.</p><p>Repeat for the recommended number of repetitions.</p>',
    fullVideoUrl: "https://www.youtube.com/embed/eZU9Ss1Jc0E?autoplay=1",
    fullVideoImageUrl: "https://img.youtube.com/vi/eZU9Ss1Jc0E/hqdefault.jpg",
    introduction: '<p>Le <strong>tirage poitrine à la poulie</strong> est un exercice d\'isolation efficace pour les <strong>pectoraux</strong>. Il permet une tension constante tout au long du mouvement, ce qui en fait un excellent choix pour développer la masse musculaire de la poitrine.</p>',
    introductionEn: '<p>The <strong>cable chest fly</strong> is an effective isolation exercise for the <strong>chest</strong>. It provides constant tension throughout the movement, making it an excellent choice for developing chest muscle mass.</p>',
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

export async function GET() {
  const logs: string[] = [];

  try {
    // Check if already seeded
    const existingAttributeNames = await prisma.exerciseAttributeName.count();
    const existingExercises = await prisma.exercise.count();

    if (existingAttributeNames > 0 && existingExercises > 0) {
      return NextResponse.json({
        status: "already_seeded",
        message: "Database already has data. Skipping seed.",
        attributeNames: existingAttributeNames,
        exercises: existingExercises,
      });
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
    logs.push("\nStep 2: Seeding sample exercises...");
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
