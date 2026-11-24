import hero from '../../public/salatem/hero.jpg?url';
import video from '../../public/salatem/hero.mp4?url';
import oud from '../../public/salatem/oud.jpg?url';
import jasmine from '../../public/salatem/jasmine.jpg?url';
import rose from '../../public/salatem/rose.jpg?url';
import bergamot from '../../public/salatem/bergamot.jpg?url';

const bundledAssets: Record<string, string> = {
  '/salatem/hero.jpg': hero,
  '/salatem/hero.mp4': video,
  '/salatem/oud.jpg': oud,
  '/salatem/jasmine.jpg': jasmine,
  '/salatem/rose.jpg': rose,
  '/salatem/bergamot.jpg': bergamot,
};

/** Resolve shipped media through Vite's deployment base, preserving merchant URLs. */
export function salatemAsset(url: string | undefined) {
  return url ? bundledAssets[url] ?? url : undefined;
}
