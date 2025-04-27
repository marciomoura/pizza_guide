
// Flows will be imported for their side effects in this file.
import type { Flow } from "genkit";

// Keep a list of flows for local testing
export const devList: Record<string, Flow> = {};

// Import flows here to add them to the devList automatically
// e.g. import './flows/generate-dough-flow';
import './flows/generate-dough-flow';

// Log the flows available for development
if (process.env.NODE_ENV === 'development') {
    console.log('Available Genkit flows for development:');
    Object.keys(devList).forEach(flowName => console.log(`- ${flowName}`));
}
