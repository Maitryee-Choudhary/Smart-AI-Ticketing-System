import { createServer } from '@inngest/agent-kit/server';
import {supportAgent} from './utils/ai-agent.js';

createServer({
  agents: [supportAgent],
}).listen(4001, () => {
  console.log('Agent server running on port 4001');
});