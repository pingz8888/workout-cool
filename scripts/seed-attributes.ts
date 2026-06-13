import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Map attribute names to their values
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

async function main() {
  console.log("🌱 Seeding exercise attributes...");

  for (const [name, values] of Object.entries(attributeMap)) {
    // Upsert attribute name
    const attributeName = await prisma.exerciseAttributeName.upsert({
      where: { name: name as ExerciseAttributeNameEnum },
      update: {},
      create: { name: name as ExerciseAttributeNameEnum },
    });

    console.log(`  ✅ Created attribute name: ${name} (${attributeName.id})`);

    // Upsert attribute values
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

    console.log(`    → Added ${values.length} values`);
  }

  // Print summary
  const nameCount = await prisma.exerciseAttributeName.count();
  const valueCount = await prisma.exerciseAttributeValue.count();
  console.log(`\n🎉 Done! Created ${nameCount} attribute names and ${valueCount} attribute values.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
