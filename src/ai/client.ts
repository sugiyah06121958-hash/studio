// Helper function to call a flow from the client.
// This is used to avoid Server Actions which are not supported in static exports.

export async function runFlow<T>(flowId: string, input: any): Promise<T> {
    const response = await fetch(`/studio/api/genkit/${flowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Flow ${flowId} failed: ${errorText}`);
    }
  
    const result = await response.json();
    return result as T;
}
