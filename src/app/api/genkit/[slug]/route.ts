import {NextRequest, NextResponse} from 'next/server';
import {getFlow} from 'genkit';
import '@/ai';

export async function POST(
  req: NextRequest,
  {params}: {params: {slug: string}}
) {
  const flow = getFlow(params.slug);
  if (!flow) {
    console.error(`Flow not found: ${params.slug}`);
    return new NextResponse('Not Found', {status: 404});
  }

  try {
    const {input} = await req.json();
    const output = await flow.invoke(input);
    return NextResponse.json(output);
  } catch (e: any) {
    console.error(`Error invoking flow ${params.slug}:`, e);
    return new NextResponse(e.message || 'Internal Server Error', {status: 500});
  }
}
