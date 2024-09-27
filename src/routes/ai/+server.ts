import { run } from '$lib/ai';
import { json } from '@sveltejs/kit';

export async function POST({request}) {
  const { element1, element2 } = await request.json();
  let t = [element1, element2].sort();
  const response = await run(t[0], t[1]);
  return json({
      result: response
  });
};
