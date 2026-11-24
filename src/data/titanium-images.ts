import type { ImageMetadata } from 'astro';
import heroImage from '../assets/images/materials/titanium/titanium-cnc-machining-industrial-components-hero.webp';
import capabilitiesImage from '../assets/images/materials/titanium/titanium-machined-bracket-open-pocket-features.webp';
import bracketImage from '../assets/images/materials/titanium/titanium-cnc-sensor-mounting-bracket.webp';
import sleeveImage from '../assets/images/materials/titanium/titanium-cnc-stepped-sleeve-connector.webp';
import housingImage from '../assets/images/materials/titanium/titanium-cnc-instrument-interface-housing.webp';
import threeAxisImage from '../assets/images/materials/titanium/titanium-three-axis-milling-bracket-pocket.webp';
import turningImage from '../assets/images/materials/titanium/titanium-cnc-turning-sleeve-shoulder.webp';
import indexedImage from '../assets/images/materials/titanium/titanium-indexed-milling-angled-bracket-1.webp';
import fiveAxisImage from '../assets/images/materials/titanium/titanium-five-axis-contoured-equipment-mount.webp';
import qualityImage from '../assets/images/materials/titanium/titanium-bracket-cmm-locating-hole-inspection.webp';
import matteImage from '../assets/images/materials/titanium/titanium-matte-finish-equipment-cover-concept.webp';
import protectionImage from '../assets/images/materials/titanium/titanium-housing-protected-contact-faces.webp';
import productionImage from '../assets/images/materials/titanium/titanium-brackets-small-batch-order.webp';

export const titaniumImages: Record<string, { src: ImageMetadata; alt: string }> = {
  hero: { src: heroImage, alt: 'Titanium mounting bracket and flanged sleeve for industrial assemblies' },
  capabilities: { src: capabilitiesImage, alt: 'Open pocket and locating features on a titanium bracket' },
  'components:Brackets & mounting parts': { src: bracketImage, alt: 'CNC-machined titanium sensor mounting bracket' },
  'components:Shafts, sleeves & connectors': { src: sleeveImage, alt: 'Turned titanium sleeve connector with a locating shoulder' },
  'components:Custom housings & bodies': { src: housingImage, alt: 'Titanium instrument interface housing with an open cavity' },
  'processes:CNC Milling / 3-Axis': { src: threeAxisImage, alt: 'Three-axis milling an open pocket in a titanium bracket' },
  'processes:CNC Turning': { src: turningImage, alt: 'CNC turning a shoulder on a titanium sleeve' },
  'processes:3+2-Axis Milling': { src: indexedImage, alt: 'Indexed-angle machining setup for a titanium bracket' },
  'processes:Simultaneous 5-Axis': { src: fiveAxisImage, alt: 'Five-axis tool access for a contoured titanium equipment mount' },
  quality: { src: qualityImage, alt: 'CMM inspection setup for a titanium bracket locating hole' },
  'finishing:Specified treatment only': { src: matteImage, alt: 'Titanium equipment cover with a fine matte gray surface' },
  'finishing:Surface protection': { src: protectionImage, alt: 'Titanium housing supported to protect its contact faces' },
  production: { src: productionImage, alt: 'Small batch of titanium equipment brackets in a separated tray' },
};
