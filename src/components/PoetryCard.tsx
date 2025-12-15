'use client'
import { useState } from "react";
import { motion } from 'framer-motion';
import { div } from "framer-motion/client";

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

export const PoetryCard = ({ initialPoetry }: { initialPoetry: Sher }) => {
  const [currentPoetry, setCurrentPoetry] = useState<Sher | null>(initialPoetry);
  const [isLoading, setIsLoading] = useState(false);

  //this function is fetching new poetry
  const getNewPoetry = async () => {
    setIsLoading(true);
    try {
      const newPoetry = await getRandomPoetry();
      setCurrentPoetry(newPoetry);
    } catch (err) {
      console.log('there is a problem:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // this array group the sentence of poetries
  const couplets: { first: string; second?: string }[] = [];
  currentPoetry?.verses?.forEach((verse) => {
    if (verse.versePosition === 0) {
      couplets[verse.coupletIndex] = { first: verse.text };
    } else if (verse.versePosition === 1) {
      couplets[verse.coupletIndex] = {
        ...couplets[verse.coupletIndex],
        second: verse.text
      };
    }
  });

  return (
    
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-[23rem] max-w-lg flex flex-col items-center font-Nastaligh">
        {isLoading ? <img src="/original-967511bc1ecf749e666aaf23cb6f2cf2.gif" alt="spinner" className="w-full h-full" /> : (
          <>
          <h1 className="text-2xl font-bold text-indigo-900 mb-3">{currentPoetry?.title || ''}</h1>
          <div className="text-[black] mb-5">
            {couplets.map((couplet, index) => (
              <div key={index}>
                <div  className="flex justify-between gap-4 mb-2 text-right overflow-hidden" dir="rtl">
                  <span className="flex-1 text-[1.5rem] text-ellipsis">{couplet.first || 'مصرع اول'}</span>
                  <span className="flex-1 text-[1.5rem] text-ellipsis">{couplet.second || 'مصرع دوم'}</span>
                </div>
                <div><p>----------------------------------------------------------------------</p></div>
              </div>
            ))}
          </div>
          <p className="text-[1.2rem] text-gray-500 mb-3">شاعر : {currentPoetry?.category?.poet?.name || 'ناشناس'}</p>
          <button onClick={getNewPoetry} className="mt-5 px-3 py-2 bg-blue-600 text-[1.5rem] text-white rounded-md hover:bg-blue-800 transition-all">شعری دگر</button>
          <a href={'https://ganjoor.net'} target="_blank" className="text-blue-600 text-[2rem] hover:underline mt-5">گنجور</a>
          </>
        )}
      </motion.div>
  );
}