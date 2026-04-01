import React from 'react';
import type { IconType } from 'react-icons';
import type { IconPack } from '@/lib/icons/types';
import { guessPackFromIconName } from '@/lib/icons/icon-key';

// Typed module map for allowed packs
type ModAI = typeof import('react-icons/ai');
type ModBS = typeof import('react-icons/bs');
type ModBI = typeof import('react-icons/bi');
type ModCG = typeof import('react-icons/cg');
type ModDI = typeof import('react-icons/di');
type ModFC = typeof import('react-icons/fc');
type ModFI = typeof import('react-icons/fi');
type ModGO = typeof import('react-icons/go');
type ModGR = typeof import('react-icons/gr');
type ModHI = typeof import('react-icons/hi');
type ModHI2 = typeof import('react-icons/hi2');
type ModIO5 = typeof import('react-icons/io5');
type ModLIA = typeof import('react-icons/lia');
type ModMD = typeof import('react-icons/md');
type ModPI = typeof import('react-icons/pi');
type ModRI = typeof import('react-icons/ri');
type ModRX = typeof import('react-icons/rx');
type ModSI = typeof import('react-icons/si');
type ModSL = typeof import('react-icons/sl');
type ModTFI = typeof import('react-icons/tfi');
type ModTB = typeof import('react-icons/tb');

type ModuleByPack = {
  ai: ModAI;
  bs: ModBS;
  bi: ModBI;
  cg: ModCG;
  di: ModDI;
  fc: ModFC;
  fi: ModFI;
  go: ModGO;
  gr: ModGR;
  hi: ModHI;
  hi2: ModHI2;
  io5: ModIO5;
  lia: ModLIA;
  md: ModMD;
  pi: ModPI;
  ri: ModRI;
  rx: ModRX;
  si: ModSI;
  sl: ModSL;
  tfi: ModTFI;
  tb: ModTB;
};

export const PACK_LOADERS: { [K in IconPack]: () => Promise<ModuleByPack[K]> } = {
  ai: () => import('react-icons/ai'),
  bs: () => import('react-icons/bs'),
  bi: () => import('react-icons/bi'),
  cg: () => import('react-icons/cg'),
  di: () => import('react-icons/di'),
  fc: () => import('react-icons/fc'),
  fi: () => import('react-icons/fi'),
  go: () => import('react-icons/go'),
  gr: () => import('react-icons/gr'),
  hi: () => import('react-icons/hi'),
  hi2: () => import('react-icons/hi2'),
  io5: () => import('react-icons/io5'),
  lia: () => import('react-icons/lia'),
  md: () => import('react-icons/md'),
  pi: () => import('react-icons/pi'),
  ri: () => import('react-icons/ri'),
  rx: () => import('react-icons/rx'),
  si: () => import('react-icons/si'),
  sl: () => import('react-icons/sl'),
  tfi: () => import('react-icons/tfi'),
  tb: () => import('react-icons/tb'),
};

export async function tryLoadIcon(pack: IconPack, name: string): Promise<IconType | null> {
  try {
    const mod = await PACK_LOADERS[pack]();
    const exp = (mod as Record<string, unknown>)[name];
    if (!exp) return null;
    if (typeof exp === 'function') return exp as IconType;
    if (React.isValidElement(exp) && typeof exp.type === 'function') {
      return exp.type as IconType;
    }
    return null;
  } catch {
    return null;
  }
}

export async function loadIconSmart(pack: IconPack, name: string): Promise<IconType | null> {
  // 1) Try requested pack
  const first = await tryLoadIcon(pack, name);
  if (first) return first;

  // 2) Guess from name prefix (Ai/Bs/Bi/Fc/Lia/Sl/Tfi/Tb/Io/Hi/…)
  const guessed = guessPackFromIconName(name);
  if (guessed && guessed !== pack) {
    const second = await tryLoadIcon(guessed, name);
    if (second) return second;
  }

  // 3) Special cross-try for Heroicons v1/v2
  if (pack === 'hi' || pack === 'hi2') {
    const other = pack === 'hi' ? 'hi2' : 'hi';
    const third = await tryLoadIcon(other, name);
    if (third) return third;
  }

  return null;
}
