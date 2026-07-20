import { env } from './src/config/env.js';
import aiService from './src/modules/ai/ai.service.js';

const mockDiff = `
diff --git a/auth.js b/auth.js
@@ -1,5 +1,5 @@
 function login(user, pass) {
-  return user === 'admin' && pass === 'password';
+  const query = "SELECT * FROM users WHERE pass = '" + pass + "'";
 }
`;

(async () => {
  try {
    const result = await aiService.generateCodeReview(mockDiff);
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
  }
})();
