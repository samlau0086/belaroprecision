export interface MaterialSection {
  id: string;
  title: string;
  intro: string;
  items: [string, string][];
  link?: [string, string];
}
export interface MaterialPage {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  image: 'hero-cnc-turning' | 'hero-cnc-milling';
  sections: MaterialSection[];
  faqs: [string, string][];
  rfq: string;
}
const orders: MaterialSection = {
  id: 'production', title: 'Production & Repeat Orders',
  intro: 'Initial parts, low-volume batches and repeat production are reviewed against your drawing. There is no fixed MOQ; order suitability, price and estimated lead time are confirmed after technical review.',
  items: [
    ['First order', 'Share the controlled drawing revision, quantity, material specification, critical features and required documents. Agree the first-part approval and inspection scope before production.'],
    ['Repeat production', 'Identify drawing changes, annual demand and batch quantities. Material availability and delivery timing are reviewed for each order, not assumed from a previous quotation.'],
  ], link: ['/services/production/', 'Explore OEM production'],
};
const commonFaqs: [string, string][] = [
  ['What files should I send?', 'Send a dimensioned PDF drawing and a STEP model where available. Include revision, material specification, quantity, critical tolerances and acceptance requirements. Upload one file up to 20 MB, or use a ZIP for related drawings and models.'],
  ['Can you guarantee a standard tolerance or delivery time?', 'Tolerance feasibility, inspection methods, price and estimated lead time are confirmed for the specific drawing, material, quantity and processing route. No blanket machining tolerance or fixed delivery time applies to every part.'],
  ['Are small quantities and material documents available?', 'There is no fixed MOQ. Request material records, dimensional reports or other documents in the RFQ. Availability, traceability, inspection coverage and cost must be agreed before order acceptance; documents are not automatically included.'],
];
export const materialPages: MaterialPage[] = [
  {
    slug: 'brass-cnc-machining', name: 'Brass', title: 'Precision Brass CNC Machining for OEM Components',
    description: 'Drawing-based brass CNC turning and milling for connectors, bushings and threaded components. Review C360, lead requirements, interfaces, plating and inspection.',
    intro: 'Drawing-based brass connectors, bushings and threaded components for industrial assemblies. Start with the alloy specification and the interfaces that control fit and function.',
    image: 'hero-cnc-turning',
    sections: [
      { id: 'grades', title: 'Brass Alloy & Application Requirements', intro: 'C360 is an enquiry option in our material selector. Exact standard, temper, procurement and suitability are confirmed for each project; no substitution is assumed.', items: [
        ['C360 / C36000', 'A leaded free-cutting brass. Specify the governing material standard and condition rather than using “brass” as the complete purchase specification.'],
        ['Lead restrictions & alternatives', 'If lead content is restricted, state the permitted composition and application requirements. Request a specific alternative for procurement and machining review; C360 must not be treated as a lead-free grade.'],
        ['Service environment', 'Identify fluid contact, operating conditions and any electrical, drinking-water or other compliance requirements. Suitability and supporting documentation require separate agreement.'],
      ] },
      { id: 'components', title: 'Turned Interfaces & Typical Brass Components', intro: 'Component families below describe possible drawing-based enquiries, not stocked products or certified end-use assemblies.', items: [
        ['Connectors & threaded adapters', 'Internal and external threads, ports, wrench flats and seating faces. Specify thread standard, engagement, sealing geometry and any leak-test requirement.'],
        ['Bushings & sleeves', 'Concentric bores, shoulders, grooves and mating diameters. Mark fit, wall thickness and surface requirements.'],
        ['Custom inserts & small bodies', 'Turned profiles, cross-holes, milled flats and mounting features. Identify small edges and passages where burrs could affect assembly.'],
      ], link: ['/machined-parts/', 'Browse representative part families'] },
      { id: 'processes', title: 'CNC Turning, Milling & Edge Control', intro: 'The route combines the required rotational and prismatic features, with tool access, workholding and inspection reviewed from the drawing.', items: [
        ['Turning & threading', 'Review diameters, bores, grooves, thread runouts and thin sections together with the required locating datums.'],
        ['Milling & secondary features', 'Review flats, slots, cross-holes and hole patterns; 3-axis, 3+2 or simultaneous 5-axis milling is selected only where appropriate to the geometry.'],
        ['Burrs & sealing edges', 'Define edge breaks, intersecting-hole access, clean passages and sealing surfaces. Agree visual and functional acceptance rather than leaving edge treatment unspecified.'],
      ], link: ['/services/cnc-turning/', 'Explore CNC turning'] },
      { id: 'finishing', title: 'Plating, Appearance & Final Dimensions', intro: 'Plating, polishing or other finishing requests are reviewed through the supplier network. Availability, compatibility and inspection scope are confirmed before order acceptance.', items: [
        ['Plating specification', 'State the coating system, thickness, appearance and documentation requirements. Mark masking areas, threads and electrical or sealing contact surfaces.'],
        ['After-treatment fit', 'Indicate whether dimensions and thread acceptance apply before or after treatment. Include cosmetic reference samples where appearance matters.'],
      ], link: ['/services/secondary-processes/', 'Discuss secondary processes'] },
      { id: 'quality', title: 'Inspection of Threads, Bores & Functional Features', intro: 'Identify the features that determine assembly and service performance. Tolerances and measurement scope are agreed per drawing.', items: [
        ['Dimensional acceptance', 'Define datums, concentricity or runout requirements, bore fits, thread gauges and surface requirements. Request first-part or batch reports when needed.'],
        ['Functional checks', 'Specify any leak, cleanliness, conductivity or assembly check separately. These tests are not automatically included in a dimensional inspection.'],
      ], link: ['/quality/', 'Review quality requirements'] }, orders,
    ],
    faqs: [
      ['Is C360 lead-free?', 'No. C360 / C36000 is a leaded brass. If your application restricts lead, provide the governing requirements and an approved material specification for review. No lead-free substitution or compliance claim is automatic.'],
      ['Can brass parts be supplied plated?', 'Submit the coating specification, thickness, masking, target appearance and final dimensional requirements. Supplier availability, compatibility and cost are confirmed during quotation.'], ...commonFaqs,
    ], rfq: 'Include the brass alloy and temper, lead restrictions, thread and sealing details, quantity, plating requirements and required inspection records.',
  },
  {
    slug: 'carbon-alloy-steel-cnc-machining', name: 'Carbon & Alloy Steel', title: 'Carbon & Alloy Steel CNC Machining for OEM Components',
    description: 'Custom CNC-machined carbon and alloy steel shafts, blocks and plates. Review 1018, 1045, 4140, material condition, heat treatment, hardness and corrosion protection.',
    intro: 'Drawing-based steel shafts, blocks and structural components. Align the grade, supplied condition and final hardness before defining the machining route.', image: 'hero-cnc-milling',
    sections: [
      { id: 'grades', title: 'Steel Grade, Condition & Hardness', intro: '1018, 1045 and 4140 are existing enquiry options, not interchangeable specifications or guarantees of stock. State the governing standard, supply condition and final requirements.', items: [
        ['Carbon Steel 1018', 'Submit the required product form and supplied condition, together with the drawing features and service requirements for review.'],
        ['Carbon Steel 1045', 'Identify required hardness and any heat-treatment specification. Do not assume the same processing route or acceptance criteria as 1018.'],
        ['Alloy Steel 4140', 'Distinguish annealed, prehardened or other specified conditions. Include hardness range, test locations and any required material records.'],
      ] },
      { id: 'heat-treatment', title: 'Plan Machining Around Heat Treatment', intro: 'Agree the incoming condition and treatment sequence before quotation. Heat treatment is a coordinated secondary-process request, with supplier availability and process scope confirmed per order.', items: [
        ['Before treatment', 'Review rough-machining stages, locating datums, remaining stock and surfaces that require protection. Define the treatment and any case or hardness requirements.'],
        ['After treatment', 'Identify final fits, distortion acceptance and surfaces requiring finish machining or grinding. Feasibility depends on the specified hardness, geometry and available finishing route.'],
        ['Verification', 'Specify hardness test method, locations, acceptable range and documentation. Any destructive testing or special metallurgical verification requires separate agreement.'],
      ], link: ['/services/secondary-processes/', 'Review heat treatment coordination'] },
      { id: 'components', title: 'Steel Components & Machining Routes', intro: 'CNC turning and milling are selected around the component geometry, material condition and critical load-bearing interfaces.', items: [
        ['Shafts, pins & sleeves', 'Turned diameters, shoulders, bores and grooves reviewed for fit, runout, hardness and final surface requirements.'],
        ['Blocks, plates & mounting parts', 'Milled faces, pockets, slots and hole patterns reviewed for flatness, locating datums and machining access.'],
        ['Multi-side features', '3-axis, 3+2 and simultaneous 5-axis milling are reviewed where the drawing requires angled access or complex geometry. Additional grinding is confirmed separately.'],
      ], link: ['/services/cnc-machining/', 'Explore machining capabilities'] },
      { id: 'quality', title: 'Dimensional, Hardness & Material Verification', intro: 'Define acceptance at the final delivered condition rather than treating material, machining and heat treatment as unrelated requirements.', items: [
        ['Critical interfaces', 'Mark datum systems, fits, hole positions, runout and surface requirements. Identify which dimensions apply after heat treatment and coating.'],
        ['Inspection records', 'Request dimensional reports, hardness records and material certificates with the RFQ. Their availability, measurement methods and batch coverage must be confirmed.'],
      ], link: ['/quality/', 'Discuss inspection scope'] },
      { id: 'finishing', title: 'Corrosion Protection, Coatings & Packaging', intro: 'State the storage, shipping and service environment, together with any oil-free or cleanliness requirements. Protection and treatment methods are agreed per project.', items: [
        ['Surface treatment', 'Submit any black oxide, plating or coating specification for supplier review. Define coating thickness, masking and post-treatment dimensional acceptance.'],
        ['Shipping protection', 'Agree temporary corrosion protection, separated packing, identification and protected precision faces. Identify surfaces where oils or residues are prohibited.'],
      ], link: ['/services/secondary-processes/', 'Discuss coordinated finishing'] }, orders,
    ], faqs: [
      ['Can I substitute 1018, 1045 or 4140?', 'No substitution is assumed. The exact grade, standard, supplied condition, hardness and service requirements must be specified and approved before production.'],
      ['Can you machine heat-treated steel?', 'Provide the grade, actual or required hardness, geometry and final tolerances. Machining and any grinding route are reviewed before a commitment is made; not every hardened feature is suitable for the same process.'],
      ['When should dimensions be inspected?', 'Identify which requirements apply after heat treatment, finish machining and coating. Agree inspection stages, hardness checks and final acceptance during technical review.'], ...commonFaqs,
    ], rfq: 'Include steel grade and condition, supplied and final hardness, treatment sequence, final fits, corrosion protection, quantities and inspection requirements.',
  },
  {
    slug: 'titanium-cnc-machining', name: 'Titanium', title: 'Precision Titanium CNC Machining for OEM Components',
    description: 'Drawing-based titanium CNC milling and turning. Review Grade 2 and Grade 5 specifications, thin walls, critical interfaces, traceability and inspection requirements.',
    intro: 'Drawing-based titanium components for industrial OEM assemblies. Technical review starts with the exact grade, material condition and critical interfaces.', image: 'hero-cnc-milling',
    sections: [
      { id: 'grades', title: 'Grade 2, Grade 5 & Material Traceability', intro: 'Titanium Grade 2 and Grade 5 are enquiry options. Procurement, product form, condition and documentation are confirmed per project; the grades are not assumed to be interchangeable.', items: [
        ['Titanium Grade 2', 'Specify the required standard, product form and condition. Share the operating environment and design requirements rather than relying on the grade name alone.'],
        ['Titanium Grade 5', 'State the exact material specification and condition, including any additional acceptance requirements. Grade 5 does not automatically imply an ELI or implant specification.'],
        ['Material records', 'Request the required certificates and batch traceability before quotation. Documentation availability and the chain of identification must be agreed before material procurement.'],
      ] },
      { id: 'processes', title: 'Machining Review for Critical Geometry', intro: 'CNC milling and turning are assessed against tool access, heat management, rigidity and the features that must remain stable through the machining sequence.', items: [
        ['Milled titanium parts', 'Review pockets, profiles, angled holes and complex surfaces. 3-axis, 3+2 or simultaneous 5-axis machining is selected to suit the drawing.'],
        ['Turned titanium parts', 'Review bores, shoulders, grooves and threads together with locating datums and the required final surface condition.'],
        ['Thin walls & deep features', 'Identify minimum wall sections, deep pockets and long tool reaches early. Agree workholding, feature sequence and any design changes before production.'],
      ], link: ['/services/cnc-machining/', 'Explore machining capabilities'] },
      { id: 'components', title: 'Titanium Component Enquiries', intro: 'Examples describe geometry and review priorities, not verified aerospace, medical or other regulated customer projects.', items: [
        ['Brackets & mounting parts', 'Profiles, pockets and locating holes with controlled wall thickness and interface geometry.'],
        ['Shafts, sleeves & connectors', 'Rotational features and mating surfaces reviewed for fit, runout, thread details and assembly requirements.'],
        ['Custom housings & bodies', 'Multi-face features, internal access and edge requirements reviewed together with inspection feasibility.'],
      ], link: ['/machined-parts/', 'Browse component geometry examples'] },
      { id: 'quality', title: 'Critical Features, Surface Integrity & Acceptance', intro: 'Mark the dimensions and surfaces that determine function. Inspection scope is agreed per feature, without a universal tolerance claim.', items: [
        ['Dimensions & datums', 'Define fits, hole positions, runout, thin-wall acceptance and measurement access. Request dimensional reports with the quotation.'],
        ['Edges & contact surfaces', 'Specify burr limits, edge breaks, surface roughness, thread condition and cleanliness requirements. Additional surface-integrity tests require separate review.'],
        ['Application qualification', 'State all required supplier approvals, process qualifications and documents. This page does not claim aerospace certification, medical qualification or implant-grade production.'],
      ], link: ['/quality/', 'Review quality requirements'] },
      { id: 'finishing', title: 'Finishing, Cleaning & Handling', intro: 'Do not assume an aluminum or steel finishing route applies to titanium. Any treatment is reviewed for the specified titanium grade and application.', items: [
        ['Specified treatment only', 'Submit anodizing, blasting, polishing or other treatment specifications for supplier review. Availability, compatibility, masking and final dimensions require agreement.'],
        ['Surface protection', 'Define acceptable handling marks, cleaning requirements, contact-face protection and individual packing where needed. Special cleaning validation is not automatic.'],
      ], link: ['/services/secondary-processes/', 'Discuss finishing requirements'] }, orders,
    ], faqs: [
      ['Are Grade 2 and Grade 5 interchangeable?', 'No. Specify the exact grade, standard, product form and condition required by the design. Any material change needs explicit approval.'],
      ['Do you offer certified aerospace or implant parts?', 'No such qualification is implied by this page. Provide all required approvals, material specifications, process qualifications and traceability requirements for a separate capability review before placing an order.'],
      ['Can thin walls and complex features be machined?', 'Send the model and drawing with wall thickness, deep features, critical surfaces and tolerances identified. Workholding, access, inspection and feature stability are reviewed before feasibility is confirmed.'], ...commonFaqs,
    ], rfq: 'Include the titanium grade, standard and condition, traceability requirements, critical walls and interfaces, surface acceptance, quantities and application-specific approvals.',
  },
  {
    slug: 'engineering-plastics-cnc-machining', name: 'Engineering Plastics', title: 'Engineering Plastics CNC Machining for OEM Components',
    description: 'Custom CNC-machined engineering plastic parts. Review POM, PA, PEEK, PTFE, ABS, PC and PMMA with grade, environment, dimensional stability and functional fits.',
    intro: 'Drawing-based polymer components for equipment and machinery. Select the exact material around the operating environment, functional fit and inspection conditions.', image: 'hero-cnc-milling',
    sections: [
      { id: 'application', title: 'Start with the Operating Conditions', intro: 'Material selection needs more than a polymer abbreviation. Share temperature, load, exposure and assembly requirements before confirming the grade.', items: [
        ['Temperature, moisture & chemicals', 'State normal and peak temperatures, humidity, fluid contact and cleaning agents. Identify whether dimensions must be accepted dry, conditioned or in the service environment.'],
        ['Load, movement & fit', 'Define sustained loads, sliding contact, press fits and expected duty. Request a review of creep, wear and assembly behavior where relevant.'],
        ['Special requirements', 'Specify electrical, optical, food-contact, medical, flame or other requirements with their governing standards. A polymer family name is not evidence of compliance.'],
      ] },
      { id: 'grades', title: 'Engineering Plastic Material Options', intro: 'The following families are listed in our enquiry form. Exact manufacturer grade, stock form, filler, color, procurement and suitability are confirmed per project; no family-level substitution is assumed.', items: [
        ['POM / Acetal & Nylon / PA', 'Specify the exact grade, filled or unfilled condition and moisture acceptance. For PA, agree conditioning and inspection requirements where moisture-related dimensional change matters.'],
        ['PEEK & PTFE', 'Identify the exact formulation and any reinforcement or filler. Provide temperature, chemical exposure, load and dimensional requirements for review.'],
        ['ABS, Polycarbonate / PC & PMMA / Acrylic', 'Define grade and color, cosmetic surfaces and any optical or transparency requirements. Clear appearance, polished edges and optical performance require separate acceptance criteria.'],
      ] },
      { id: 'stability', title: 'Dimensional Stability & Functional Tolerances', intro: 'Agree the inspection environment and delivered material state. Moisture uptake and internal stress can affect dimensional stability; the review must consider the particular polymer and stock.', items: [
        ['Measurement conditions', 'Specify temperature, humidity or conditioning state where required. Define when measurements are taken and which dimensions control assembly.'],
        ['Machining sequence', 'Review stock removal, thin walls, clamping and any intermediate conditioning or stress-relief request. These steps are confirmed for the specific grade, not universally applied.'],
        ['Functional acceptance', 'Identify free-state dimensions, installed fits, seal contact and load conditions. Avoid applying metal-part tolerances without a material-specific feasibility review.'],
      ], link: ['/quality/', 'Discuss dimensional acceptance'] },
      { id: 'components', title: 'Plastic Components & CNC Processes', intro: 'CNC milling and turning are reviewed for one-off and batch enquiries. Examples below describe part geometry, not verified application qualifications.', items: [
        ['Bushings, sleeves & spacers', 'Turned bores, shoulders and mating diameters with fit, wall thickness and assembly conditions defined.'],
        ['Guides, wear pads & fixtures', 'Milled profiles, slots and mounting patterns reviewed against contact conditions and locating requirements.'],
        ['Housings, covers & machined blocks', 'Pockets, thin sections and multi-side holes. 3-axis, 3+2 and simultaneous 5-axis routes are considered according to access and geometry.'],
      ], link: ['/services/cnc-machining/', 'Explore milling and turning'] },
      { id: 'finishing', title: 'Edges, Cleanliness & Surface Appearance', intro: 'Specify plastic-part acceptance directly rather than copying a metal plating or anodizing specification. Additional finishing and cleaning processes are agreed per grade and application.', items: [
        ['Burrs & surface condition', 'Mark edge breaks, allowable tool marks, scratch-sensitive surfaces and any restrictions on residues or cleaning agents.'],
        ['Optical & cosmetic requests', 'Define the required viewing surfaces and reference appearance. A machined PC or PMMA part is not automatically optically clear or optical-grade.'],
        ['Handling & packaging', 'Request protection of cosmetic faces, separation of delicate sections and appropriate material identification. Special cleanliness or validated packaging requires separate agreement.'],
      ] }, orders,
    ], faqs: [
      ['Which engineering plastic should I select?', 'Share operating temperature, moisture, chemicals, loading, friction, electrical and compliance requirements. Specify the approved manufacturer grade, filler and color where available; POM, PA, PEEK and PTFE are not interchangeable.'],
      ['Can plastic parts use the same tolerances as metal parts?', 'Not by default. Grade, stock form, wall thickness, clamping, temperature, moisture and measurement state must be reviewed. Define the functional fit and agreed inspection conditions.'],
      ['Are food-contact, medical or flame ratings included?', 'No. State the exact grade, governing requirements and documents needed. Procurement, traceability and supporting documentation must be confirmed for the particular material and order.'], ...commonFaqs,
    ], rfq: 'Include polymer and manufacturer grade, filler and color, operating conditions, conditioning and measurement requirements, functional fits, quantities and required documentation.',
  },
];

export const materialLinks = [
  { href: '/materials/aluminum-cnc-machining/', label: 'Aluminum CNC Machining' },
  { href: '/materials/stainless-steel-cnc-machining/', label: 'Stainless Steel CNC Machining' },
  ...materialPages.map(page => ({ href: `/materials/${page.slug}/`, label: `${page.name} CNC Machining` })),
];
