import gsapCore from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { CustomEase } from 'gsap/CustomEase';

let registered = false;

export function registerGsap() {
  if (registered) return;
  
  gsapCore.registerPlugin(
    ScrollTrigger,
    Flip,
    MotionPathPlugin,
    CustomEase
  );
  
  CustomEase.create("cinematic", "0.25, 1, 0.5, 1");
  CustomEase.create("ui", "0.4, 0, 0.2, 1");
  
  registered = true;
}

export const gsap = gsapCore;
export { ScrollTrigger, Flip, MotionPathPlugin, CustomEase };
