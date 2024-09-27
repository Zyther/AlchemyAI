<script lang="ts">
    import { browser } from '$app/environment';

// import { elements, combinations, combineElements, addNewElement, addCombination } from '$lib/alchemy';
    import { Col, Container, Row, Button } from '@sveltestrap/sveltestrap';
    import { onMount } from 'svelte';

let selectedElements: string[] = [];
let result: string = '';
import { writable } from 'svelte/store';

interface Element {
  name: string;
}

interface Combination {
  element1: string;
  element2: string;
  result: string;
}

const initialElements: Element[] = [
  { name: '💦 Water' },
  { name: '🔥 Fire' },
  { name: '🌎 Earth' },
  { name: '🌬️ Wind' }
];



export const elements = writable<Element[]>(initialElements);
export const combinations = writable<Combination[]>([]);

onMount(() => {
  if (browser) {
    let combos = localStorage.getItem("combinations");
    if (combos) {
       combinations.set(JSON.parse(combos));
     }
     let els = localStorage.getItem("elements");
      if (els) {
        elements.set(JSON.parse(els));
      }
  }
});

// Cache to store previous combinations
const combinationCache = new Map<string, string>();

async function getAIResponse(element1: string, element2: string): Promise<string> {
  try {
  // return await run(element1, element2);
  let z = await fetch("/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ element1, element2 }),
  });
  let y = await z.json();
  return y.result;
} catch (ex) {
  console.error(ex);
   return "No Reaction";
}
}

export async function combineElements(element1: string, element2: string) {

  let t = [element1, element2].sort();
  
  for (let c of $combinations) {
    if (c.element1 === t[0] && c.element2 === t[1]) {
       return c.result;
     }
  }


  const result = await getAIResponse(t[0], t[1]);


  if (result.toLowerCase() !== '🚫 no reaction' && result !== element1 && result !== element2) {
    addNewElement({ name: result });
  }

  addCombination({ element1: t[0], element2: t[1], result });
}

export function addNewElement(newElement: Element) {
  elements.update(els => {
    if (!els.some(el => el.name === newElement.name)) {
      return [...els, newElement];
    }
    return els;
  });
  localStorage.setItem("elements", JSON.stringify($elements));
}

export function addCombination(combination: Combination) {
  combinations.update(combs => [...combs, combination]);
  localStorage.setItem("combinations", JSON.stringify($combinations));
}

async function handleCombine() {
  if (selectedElements.length === 2) {
    await combineElements(selectedElements[0], selectedElements[1]);
    selectedElements = [];
  }
}

function selectElement(element: string) {
  if (selectedElements.length < 2) {
    selectedElements = [...selectedElements, element];
  }
}

function clear() {
  selectedElements = [];
}
function reset() {
  elements.set(initialElements);
   combinations.set([]);
   localStorage.removeItem("elements");
   localStorage.removeItem("combinations");
}
</script>

  
  <Container fluid>
    <Row>
      <Col>
        <h2>Combination Area</h2>
        <p>Selected Elements: {selectedElements.join(' + ')}</p>
        <Button on:click={handleCombine} disabled={selectedElements.length !== 2}>Combine</Button>
        {#if result}
          <p>Result: 
            {#if result === 'No Reaction'}
              No Reaction
            {:else if $elements.some(el => el.name === result)}
              {result} (Existing Element)
            {:else}
              {result} (New Element)
            {/if}
          </p>
        {/if}
        </Col>
      <Col>
        <h2>Available Elements</h2>
          {#each $elements as element}
              <Button on:click={() => selectElement(element.name)}>{element.name}</Button>
          {/each}
      </Col>
    </Row>
    
  </Container>

  

  <Container>
    <h2>Previous Combinations</h2>
    <ul>
      {#each $combinations as combination}
        <li>{combination.element1} + {combination.element2} = {combination.result}</li>
      {/each}
    </ul>
    <Button on:click={clear}>Clear</Button>
    <Button on:click={reset}>RESET GAME</Button>
  </Container>

<style>

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
  }

  button {
    padding: 5px 10px;
    cursor: pointer;
  }
</style>