import { PoetryCard } from "@/components/PoetryCard";

interface Sher {
  title?: string;
  plainText?: string;
  category?: {
    poet?: {
      name?: string;
    };
  };
  fullUrl?: string;
  verses?: { 
    text: string;
    coupletIndex: number;
    versePosition: number;
  }[];
}

//this function is fetching random poetry
const getRandomPoetry = async (): Promise<Sher> => {
  const res = await fetch('https://api.ganjoor.net/api/ganjoor/poem/random', {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('there a trouble in fetching the data');
  return res.json();
}

export default async function Home() {
  const firstPoetry = await getRandomPoetry();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-blue-500 flex items-center justify-center p-5">
      <PoetryCard initialPoetry={firstPoetry}/>
    </div>
  );
}