import { registerSchema } from './src/validators/schemas.js';

const result = registerSchema.safeParse({});
if (!result.success) {
  console.log("KEYS:", Object.keys(result.error));
  console.log("ISSUES:", result.error.issues);
} else {
  console.log("SUCCESS:", result.data);
}

