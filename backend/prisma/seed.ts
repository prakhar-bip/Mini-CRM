import { runDatabaseSeed } from '../src/services/seed.service';

if (require.main === module) {
  runDatabaseSeed()
    .catch((e) => {
      console.error('❌ Error during bulk database seeding:', e);
      process.exit(1);
    });
}

export { runDatabaseSeed };
