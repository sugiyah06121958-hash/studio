import {NextRequest, NextResponse} from 'next/server';
import {getFlow} from 'genkit';

export async function POST(
  req: NextRequest,
  {params}: {params: {slug: string}}
) {
  const flow = getFlow(params.slug);
  if (!flow) {
    return new NextResponse('Not Found', {status: 404});
  }
  const {input} = await req.json();
  const output = await flow.invoke(input);
  return NextResponse.json(output);
}
