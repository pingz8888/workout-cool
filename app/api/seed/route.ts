import { NextResponse } from "next/server";
import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum, PrismaClient } from "@prisma/client";
import { exerciseSeedData } from "../../../scripts/exercise-seed-data";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";
  const logs: string[] = [];

  try {
    // Check if already seeded
    const existingCount = await prisma.exercise.count();
    if (existingCount > 0 && !force) {
      return NextResponse.json({
        status: "already_seeded",
        message: `Database already has ${existingCount} exercises. Use ?force=true to re-seed.`,
      });
    }

    if (force) {
      logs.push("Force re-seed requested, clearing existing data...");
      await prisma.exerciseAttribute.deleteMany();
      await prisma.exercise.deleteMany();
      logs.push("Cleared existing exercises and attributes");
    }

    // =============================================
    // Step 1: Seed Attribute Taxonomy
    // =============================================
    logs.push("\n--- Step 1: Seeding attribute taxonomy ---");

    let nameCount = 0;
    let valueCount = 0;

    for (const [nameEnum, values] of Object.entries(attributeMap)) {
      await prisma.exerciseAttributeName.upsert({
        where: { name: nameEnum as ExerciseAttributeNameEnum },
        update: {},
        create: { name: nameEnum as ExerciseAttributeNameEnum },
      });
      nameCount++;

      for (const valueEnum of values) {
        // Use findFirst + create since ExerciseAttributeValue uses compound unique key
        const existing = await prisma.exerciseAttributeValue.findFirst({
          where: { value: valueEnum },
        });
        if (!existing) {
          // Need the attribute name ID for the compound key
          const attrName = await prisma.exerciseAttributeName.findUnique({
            where: { name: nameEnum as ExerciseAttributeNameEnum },
          });
          if (attrName) {
            await prisma.exerciseAttributeValue.create({
              data: {
                attributeNameId: attrName.id,
                value: valueEnum,
              },
            });
          }
        }
        valueCount++;
      }
    }

    logs.push(`Created ${nameCount} attribute names, ${valueCount} attribute values`);

    // =============================================
    // Step 2: Import All Exercises
    // =============================================
    logs.push(`\n--- Step 2: Importing ${exerciseSeedData.length} exercises ---`);

    let imported = 0;
    let errors = 0;

    for (const exercise of exerciseSeedData) {
      try {
        // Upsert exercise by slug (use English slug as unique key, fall back to French)
        const uniqueSlug = exercise.slugEn || exercise.slug || (exercise.nameEn || exercise.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

        const dbExercise = await prisma.exercise.upsert({
          where: { slugEn: uniqueSlug },
          update: {
            name: exercise.name,
            nameEn: exercise.nameEn,
            description: exercise.description || null,
            descriptionEn: exercise.descriptionEn || null,
            introduction: exercise.introduction || null,
            introductionEn: exercise.introductionEn || null,
            fullVideoUrl: exercise.fullVideoUrl || null,
            fullVideoImageUrl: exercise.fullVideoImageUrl || null,
            slug: exercise.slug || null,
            slugEn: uniqueSlug,
          },
          create: {
            name: exercise.name,
            nameEn: exercise.nameEn,
            description: exercise.description || null,
            descriptionEn: exercise.descriptionEn || null,
            introduction: exercise.introduction || null,
            introductionEn: exercise.introductionEn || null,
            fullVideoUrl: exercise.fullVideoUrl || null,
            fullVideoImageUrl: exercise.fullVideoImageUrl || null,
            slug: exercise.slug || null,
            slugEn: uniqueSlug,
          },
        });

        // Delete old attributes for this exercise
        await prisma.exerciseAttribute.deleteMany({
          where: { exerciseId: dbExercise.id },
        });

        // Create new attributes
        for (const attr of exercise.attributes) {
          try {
            const attributeName = await prisma.exerciseAttributeName.findUnique({
              where: { name: attr.attributeName as ExerciseAttributeNameEnum },
            });
            const attributeValue = await prisma.exerciseAttributeValue.findFirst({
              where: { value: attr.attributeValue as ExerciseAttributeValueEnum },
            });

            if (attributeName && attributeValue) {
              await prisma.exerciseAttribute.create({
                data: {
                  exerciseId: dbExercise.id,
                  attributeNameId: attributeName.id,
                  attributeValueId: attributeValue.id,
                },
              });
            }
          } catch {
            // Skip duplicate or invalid attributes
          }
        }

        imported++;
        if (imported % 100 === 0) {
          logs.push(`  Progress: ${imported}/${exerciseSeedData.length}`);
        }
      } catch (error) {
        errors++;
        if (errors <= 5) {
          logs.push(`  Error: ${exercise.nameEn || exercise.name} - ${error}`);
        }
      }
    }

    const totalExercises = await prisma.exercise.count();
    const totalAttributes = await prisma.exerciseAttribute.count();

    logs.push(`\nDone! ${totalExercises} exercises, ${totalAttributes} attributes`);
    logs.push(`Imported: ${imported}, Errors: ${errors}`);

    return NextResponse.json({
      status: "success",
      message: `Seeded ${totalExercises} exercises successfully!`,
      summary: {
        attributeNames: nameCount,
        attributeValues: valueCount,
        exercises: totalExercises,
        exerciseAttributes: totalAttributes,
        imported,
        errors,
      },
      logs,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error", logs },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
