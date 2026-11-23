import type { ImageMetadata } from 'astro';
import heroImage from '../assets/images/materials/engineering-plastics/engineering-plastics-cnc-machining-oem-components-hero.webp';
import capabilitiesImage from '../assets/images/materials/engineering-plastics/peek-cnc-fixture-body-machined-features.webp';
import bushingImage from '../assets/images/materials/engineering-plastics/pom-cnc-flanged-bushing.webp';
import guideImage from '../assets/images/materials/engineering-plastics/pa-cnc-slotted-equipment-guide.webp';
import housingImage from '../assets/images/materials/engineering-plastics/abs-cnc-instrument-housing.webp';
import threeAxisImage from '../assets/images/materials/engineering-plastics/pom-three-axis-milling-guide-slot.webp';
import turningImage from '../assets/images/materials/engineering-plastics/ptfe-cnc-turning-sleeve.webp';
import indexedMillingImage from '../assets/images/materials/engineering-plastics/pc-indexed-milling-angled-equipment-cover.webp';
import fiveAxisImage from '../assets/images/materials/engineering-plastics/peek-five-axis-contoured-fixture.webp';
import conditioningImage from '../assets/images/materials/engineering-plastics/pa-rough-machined-guide-resting-support.webp';
import measurementImage from '../assets/images/materials/engineering-plastics/polymer-housing-environmental-inspection-context.webp';
import acceptanceImage from '../assets/images/materials/engineering-plastics/polymer-guide-noncontact-dimensional-inspection.webp';
import deburringImage from '../assets/images/materials/engineering-plastics/polymer-cnc-cover-deburred-edge-detail.webp';
import opticalImage from '../assets/images/materials/engineering-plastics/pmma-cnc-guard-machined-edge-appearance.webp';
import handlingImage from '../assets/images/materials/engineering-plastics/polymer-housing-protected-cosmetic-surfaces.webp';
import productionImage from '../assets/images/materials/engineering-plastics/polymer-bushings-small-batch-packing.webp';

export const engineeringPlasticsImages: Record<string, { src: ImageMetadata; alt: string }> = {
  "hero": { src: heroImage, alt: "CNC-machined polymer bushings, a guide and a fixture component" },
  "capabilities": { src: capabilitiesImage, alt: "A polymer fixture body with milled pockets and mounting features" },
  "components:Bushings, sleeves & spacers": { src: bushingImage, alt: "A black machined polymer flanged bushing" },
  "components:Guides, wear pads & fixtures": { src: guideImage, alt: "A machined polymer equipment guide with a mounting slot" },
  "components:Housings, covers & machined blocks": { src: housingImage, alt: "A CNC-machined polymer instrument housing with an open cavity" },
  "processes:CNC Milling / 3-Axis": { src: threeAxisImage, alt: "Three-axis milling a slot in a supported polymer guide" },
  "processes:CNC Turning": { src: turningImage, alt: "A CNC turning setup for a short white polymer sleeve" },
  "processes:3+2-Axis Milling": { src: indexedMillingImage, alt: "An indexed-angle machining setup for a polymer equipment cover" },
  "processes:Simultaneous 5-Axis": { src: fiveAxisImage, alt: "Five-axis tool access for a contoured polymer fixture" },
  "processes:Stock removal & conditioning": { src: conditioningImage, alt: "A rough-machined polymer guide resting on a flat support" },
  "quality:Measurement conditions": { src: measurementImage, alt: "A polymer housing on an inspection bench beside an environmental logger" },
  "quality:Functional acceptance": { src: acceptanceImage, alt: "A noncontact dimensional inspection setup for a polymer housing" },
  "finishing:Burrs & surface condition": { src: deburringImage, alt: "Clean machined edges and tool marks on a polymer cover" },
  "finishing:Optical & cosmetic requests": { src: opticalImage, alt: "A clear polymer equipment guard with visibly machined edges" },
  "finishing:Handling & packaging": { src: handlingImage, alt: "Separated packaging protecting a polymer housing and its cosmetic faces" },
  "production": { src: productionImage, alt: "A small batch of machined polymer bushings in separated packaging" },
};

