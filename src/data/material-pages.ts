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
  id: 'production', title: 'Production & Orders',
  intro: 'Initial parts, low-volume batches and repeat production are reviewed against your drawing. There is no fixed MOQ; order suitability, price and estimated lead time are confirmed after technical review.',
  items: [
    ['First order', 'Share the controlled drawing revision, quantity, material specification, critical features and required documents. Agree the first-part approval and inspection scope before production.'],
    ['Repeat production', 'Identify drawing changes, annual demand and batch quantities. Material availability and delivery timing are reviewed for each order, not assumed from a previous quotation.'],
  ], link: ['/services/production/', 'Explore OEM production'],
};
const commonFaqs: [string, string][] = [
  ['What files should I send?', 'Send a dimensioned PDF drawing and a STEP model where available. Include revision, material specification, quantity, critical tolerances and acceptance requirements. Upload one file up to 20 MB, or use a ZIP for related drawings and models.'],
  ['Can you guarantee a standard tolerance or delivery time?', 'Tolerance feasibility, inspection methods, price and estimated lead time are confirmed for the specific drawing, material, quantity and processing route. No blanket machining tolerance or fixed delivery time applies to every part.'],
  ['How are surface finishing, price and lead time confirmed?', 'Include the required finish, appearance, masking and after-finishing dimensions in the RFQ. Any finishing route is reviewed for the specific material and supplier availability. Price and estimated lead time depend on material procurement, geometry, quantity, machining, inspection and finishing scope, and are confirmed after technical review.'],
  ['Are small quantities and material documents available?', 'There is no fixed MOQ. Request material records, dimensional reports or other documents in the RFQ. Availability, traceability, inspection coverage and cost must be agreed before order acceptance; documents are not automatically included.'],
];
export const materialPages: MaterialPage[] = [
  {
    slug: 'brass-cnc-machining', name: 'Brass', title: 'Precision Brass CNC Machining for OEM Components',
    description: 'Drawing-based brass CNC turning and milling for connectors, bushings and threaded components. Review C360, lead requirements, interfaces, plating and inspection.',
    intro: 'Drawing-based brass connectors, bushings and threaded components for industrial assemblies. Start with the alloy specification and the interfaces that control fit and function.',
    image: 'hero-cnc-turning',
    sections: [
      { id: 'capabilities', title: 'Brass Machining Capabilities', intro: 'Drawing-based CNC milling and turning for brass components, with the alloy, geometry and functional interfaces reviewed before production.', items: [
        ['Milled & turned features', 'Faces, pockets, slots, stepped diameters, bores and grooves for custom OEM parts.'],
        ['Precision interfaces', 'Hole positions, internal and external threads, sealing seats and mating surfaces reviewed against drawing datums and acceptance requirements.'],
        ['Complex geometry & small edges', 'Cross-holes, thin sections and multi-side features reviewed for workholding, tool access and burr removal at intersecting passages.'],
      ], link: ['/services/cnc-machining/', 'Explore CNC capabilities'] },
      { id: 'grades', title: 'Brass Grades', intro: 'C360 is an enquiry option in our material selector. Exact standard, temper, procurement and suitability are confirmed for each project; no substitution is assumed.', items: [
        ['C360 / C36000', 'A leaded free-cutting brass. Specify the governing material standard and condition rather than using “brass” as the complete purchase specification.'],
        ['Lead restrictions & alternatives', 'If lead content is restricted, state the permitted composition and application requirements. Request a specific alternative for procurement and machining review; C360 must not be treated as a lead-free grade.'],
        ['Service environment', 'Identify fluid contact, operating conditions and any electrical, drinking-water or other compliance requirements. Suitability and supporting documentation require separate agreement.'],
      ] },
      { id: 'components', title: 'Typical Brass Components', intro: 'Explore illustrated component families for drawing-based enquiries.', items: [
        ['Connectors & threaded adapters', 'Internal and external threads, ports, wrench flats and seating faces. Specify thread standard, engagement, sealing geometry and any leak-test requirement.'],
        ['Bushings & sleeves', 'Concentric bores, shoulders, grooves and mating diameters. Mark fit, wall thickness and surface requirements.'],
        ['Custom inserts & small bodies', 'Turned profiles, cross-holes, milled flats and mounting features. Identify small edges and passages where burrs could affect assembly.'],
      ], link: ['/machined-parts/', 'Browse representative part families'] },
      { id: 'processes', title: 'CNC Machining Processes', intro: 'The route combines the required rotational and prismatic features, with tool access, workholding and inspection reviewed from the drawing.', items: [
        ['CNC Turning', 'Diameters, bores, grooves and threads reviewed together with thread runouts, locating datums and thin sections.'],
        ['CNC Milling / 3-Axis', 'Accessible faces, flats, slots, cross-holes and hole patterns for prismatic brass features.'],
        ['3+2-Axis Milling', 'Fixed-angle positioning for inclined and multi-side features, with the rotary axes stationary during cutting.'],
        ['Simultaneous 5-Axis', 'Coordinated linear and rotary motion for complex surfaces and multi-directional tool access, where suitable for the drawing.'],
      ], link: ['/services/cnc-turning/', 'Explore CNC turning'] },
      { id: 'quality', title: 'Tolerances & Quality Control', intro: 'Identify the features that determine assembly and service performance. Tolerances and measurement scope are agreed per drawing.', items: [
        ['Dimensional acceptance', 'Define datums, concentricity or runout requirements, bore fits, thread gauges and surface requirements. Request first-part or batch reports when needed.'],
        ['Functional checks', 'Specify any leak, cleanliness, conductivity or assembly check separately. These tests are not automatically included in a dimensional inspection.'],
        ['Burrs & sealing edges', 'Define edge breaks, intersecting-hole access, clean passages and sealing surfaces. Agree visual and functional acceptance rather than leaving edge treatment unspecified.'],
      ], link: ['/quality/', 'Review quality requirements'] },
      { id: 'finishing', title: 'Surface Finishing', intro: 'Plating, polishing or other finishing requests are reviewed through the supplier network. Availability, compatibility and inspection scope are confirmed before order acceptance.', items: [
        ['Plating specification', 'State the coating system, thickness, appearance and documentation requirements. Mark masking areas, threads and electrical or sealing contact surfaces.'],
        ['Polishing & appearance', 'Identify cosmetic faces, target roughness or reference appearance and edge requirements. Confirm the preparation and treatment route before order acceptance.'],
        ['After-treatment fit', 'Indicate whether dimensions and thread acceptance apply before or after treatment. Include cosmetic reference samples where appearance matters.'],
      ], link: ['/services/secondary-processes/', 'Discuss secondary processes'] }, orders,
    ],
    faqs: [
      ['Is C360 lead-free?', 'No. C360 / C36000 is a leaded brass. If your application restricts lead, provide the governing requirements and an approved material specification for review. No lead-free substitution or compliance claim is automatic.'],
      ['Can brass parts be supplied plated?', 'Submit the coating specification, thickness, masking, target appearance and final dimensional requirements. Supplier availability, compatibility and cost are confirmed during quotation.'], ...commonFaqs,
    ], rfq: 'Include the brass alloy and temper, lead restrictions, thread and sealing details, quantity, plating requirements and required inspection records.',
  },
  {
    slug: 'carbon-alloy-steel-cnc-machining', name: 'Carbon & Alloy Steel', title: 'Precision Carbon & Alloy Steel CNC Machining for OEM Components',
    description: 'Custom CNC-machined carbon and alloy steel shafts, blocks and plates. Review 1018, 1045, 4140, material condition, heat treatment, hardness and corrosion protection.',
    intro: 'Drawing-based steel shafts, blocks and structural components. Align the grade, supplied condition and final hardness before defining the machining route.', image: 'hero-cnc-milling',
    sections: [
      { id: 'capabilities', title: 'Carbon & Alloy Steel Machining Capabilities', intro: 'CNC milling and turning for drawing-based steel components, with the supplied condition, final hardness and treatment sequence reviewed together.', items: [
        ['Milling & turning', 'Faces, pockets, slots, stepped shafts, bores, grooves and threads for industrial OEM assemblies.'],
        ['Precision features', 'Locating holes, bearing fits, shoulders and mating faces reviewed against datum, runout and surface requirements.'],
        ['Complex & treated parts', 'Multi-side geometry and critical features reviewed for rigidity, tool access, hardness, machining allowance and potential treatment distortion.'],
      ], link: ['/services/cnc-machining/', 'Explore CNC capabilities'] },
      { id: 'grades', title: 'Carbon & Alloy Steel Grades', intro: '1018, 1045 and 4140 are existing enquiry options, not interchangeable specifications or guarantees of stock. State the governing standard, supply condition and final requirements.', items: [
        ['Carbon Steel 1018', 'Submit the required product form and supplied condition, together with the drawing features and service requirements for review.'],
        ['Carbon Steel 1045', 'Identify required hardness and any heat-treatment specification. Do not assume the same processing route or acceptance criteria as 1018.'],
        ['Alloy Steel 4140', 'Distinguish annealed, prehardened or other specified conditions. Include hardness range, test locations and any required material records.'],
      ] },
      { id: 'components', title: 'Typical Carbon & Alloy Steel Components', intro: 'Explore illustrated component families for equipment and machinery, quoted to your drawing.', items: [
        ['Shafts, pins & sleeves', 'Turned diameters, shoulders, bores and grooves reviewed for fit, runout, hardness and final surface requirements.'],
        ['Blocks, plates & mounting parts', 'Milled faces, pockets, slots and hole patterns reviewed for flatness, locating datums and machining access.'],
        ['Custom housings & bodies', 'Multi-face features, bores and threaded interfaces reviewed against material condition and critical load-bearing requirements.'],
      ], link: ['/services/cnc-machining/', 'Explore machining capabilities'] },
      { id: 'processes', title: 'CNC Machining Processes', intro: 'Select the machining route around the steel condition, tool access and final requirements. Plan machining around heat treatment, with supplier scope confirmed per order.', items: [
        ['CNC Milling / 3-Axis', 'Accessible faces, pockets, slots and hole patterns on blocks, plates and mounting components.'],
        ['CNC Turning', 'Diameters, shoulders, bores, grooves and threads for shafts, pins and sleeves.'],
        ['3+2-Axis Milling', 'Fixed-angle positioning for inclined faces and multi-side features; rotary axes remain stationary during cutting.'],
        ['Simultaneous 5-Axis', 'Coordinated linear and rotary motion for complex surfaces and multi-directional tool access where suitable.'],
        ['Heat-treatment sequence', 'Agree rough-machining stages, remaining stock and protected surfaces before treatment. Review final fits, distortion acceptance and finish machining or grinding after treatment; feasibility depends on hardness and geometry.'],
      ], link: ['/services/secondary-processes/', 'Review heat treatment coordination'] },
      { id: 'quality', title: 'Tolerances & Quality Control', intro: 'Define acceptance at the final delivered condition rather than treating material, machining and heat treatment as unrelated requirements.', items: [
        ['Critical interfaces', 'Mark datum systems, fits, hole positions, runout and surface requirements. Identify which dimensions apply after heat treatment and coating.'],
        ['Inspection records', 'Request dimensional reports, hardness records and material certificates with the RFQ. Their availability, measurement methods and batch coverage must be confirmed.'],
        ['Hardness verification', 'Specify hardness test method, locations, acceptable range and documentation. Any destructive testing or special metallurgical verification requires separate agreement.'],
      ], link: ['/quality/', 'Discuss inspection scope'] },
      { id: 'finishing', title: 'Surface Finishing', intro: 'State the storage, shipping and service environment, together with any oil-free or cleanliness requirements. Protection and treatment methods are agreed per project.', items: [
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
      { id: 'capabilities', title: 'Titanium Machining Capabilities', intro: 'Drawing-based CNC milling and turning for titanium OEM components. Review tool access, heat management, rigidity and critical interfaces before confirming feasibility.', items: [
        ['Milled & turned features', 'Pockets, profiles, stepped diameters, bores, grooves and threads reviewed against the exact titanium grade and condition.'],
        ['Precision interfaces', 'Locating holes, mating faces and concentric features reviewed together with datum systems and inspection access.'],
        ['Thin walls & deep features', 'Identify minimum wall sections, deep pockets and long tool reaches early. Agree workholding, feature sequence and any design changes before production.'],
      ], link: ['/services/cnc-machining/', 'Explore machining capabilities'] },
      { id: 'grades', title: 'Titanium Grades', intro: 'Titanium Grade 2 and Grade 5 are enquiry options. Procurement, product form, condition and documentation are confirmed per project; the grades are not assumed to be interchangeable.', items: [
        ['Titanium Grade 2', 'Specify the required standard, product form and condition. Share the operating environment and design requirements rather than relying on the grade name alone.'],
        ['Titanium Grade 5', 'State the exact material specification and condition, including any additional acceptance requirements. Grade 5 does not automatically imply an ELI or implant specification.'],
        ['Material records', 'Request the required certificates and batch traceability before quotation. Documentation availability and the chain of identification must be agreed before material procurement.'],
      ] },
      { id: 'components', title: 'Typical Titanium Components', intro: 'Explore illustrated component geometries. Include any required supplier approvals, qualifications and documentation with your enquiry.', items: [
        ['Brackets & mounting parts', 'Profiles, pockets and locating holes with controlled wall thickness and interface geometry.'],
        ['Shafts, sleeves & connectors', 'Rotational features and mating surfaces reviewed for fit, runout, thread details and assembly requirements.'],
        ['Custom housings & bodies', 'Multi-face features, internal access and edge requirements reviewed together with inspection feasibility.'],
      ], link: ['/machined-parts/', 'Browse component geometry examples'] },
      { id: 'processes', title: 'CNC Machining Processes', intro: 'Select the route around tool access, rigidity, heat management and feature stability for the specified titanium grade.', items: [
        ['CNC Milling / 3-Axis', 'Accessible faces, pockets, profiles and hole patterns, with cutting sequence and workholding reviewed for the geometry.'],
        ['CNC Turning', 'Bores, shoulders, grooves and threads reviewed together with locating datums and final surface condition.'],
        ['3+2-Axis Milling', 'Fixed-angle positioning for inclined holes and multi-side features; rotary axes remain stationary during cutting.'],
        ['Simultaneous 5-Axis', 'Coordinated linear and rotary motion for complex surfaces and multi-directional access where appropriate to the drawing.'],
      ], link: ['/services/cnc-machining/', 'Explore machining capabilities'] },
      { id: 'quality', title: 'Tolerances & Quality Control', intro: 'Mark the dimensions and surfaces that determine function. Inspection scope is agreed per feature, without a universal tolerance claim.', items: [
        ['Dimensions & datums', 'Define fits, hole positions, runout, thin-wall acceptance and measurement access. Request dimensional reports with the quotation.'],
        ['Edges & contact surfaces', 'Specify burr limits, edge breaks, surface roughness, thread condition and cleanliness requirements. Additional surface-integrity tests require separate review.'],
        ['Application qualification', 'State all required supplier approvals, process qualifications and documents. This page does not claim aerospace certification, medical qualification or implant-grade production.'],
      ], link: ['/quality/', 'Review quality requirements'] },
      { id: 'finishing', title: 'Surface Finishing', intro: 'Do not assume an aluminum or steel finishing route applies to titanium. Any treatment is reviewed for the specified titanium grade and application.', items: [
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
    slug: 'engineering-plastics-cnc-machining', name: 'Engineering Plastics', title: 'Precision Engineering Plastics CNC Machining for OEM Components',
    description: 'Custom CNC-machined engineering plastic parts. Review POM, PA, PEEK, PTFE, ABS, PC and PMMA with grade, environment, dimensional stability and functional fits.',
    intro: 'Drawing-based polymer components for equipment and machinery. Select the exact material around the operating environment, functional fit and inspection conditions.', image: 'hero-cnc-milling',
    sections: [
      { id: 'capabilities', title: 'Engineering Plastics Machining Capabilities', intro: 'CNC milling and turning for drawing-based polymer components. Review geometry and operating conditions together before confirming material and machining suitability.', items: [
        ['Milled & turned features', 'Pockets, profiles, bores, shoulders, grooves, threads and precision hole patterns reviewed for clamping, thin sections and burr control.'],
        ['Temperature, moisture & chemicals', 'State normal and peak temperatures, humidity, fluid contact and cleaning agents. Identify whether dimensions must be accepted dry, conditioned or in the service environment.'],
        ['Load, movement & fit', 'Define sustained loads, sliding contact, press fits and expected duty. Request a review of creep, wear and assembly behavior where relevant.'],
        ['Special requirements', 'Specify electrical, optical, food-contact, medical, flame or other requirements with their governing standards. A polymer family name is not evidence of compliance.'],
      ] },
      { id: 'grades', title: 'Engineering Plastics Grades', intro: 'The following families are listed in our enquiry form. Exact manufacturer grade, stock form, filler, color, procurement and suitability are confirmed per project; no family-level substitution is assumed.', items: [
        ['POM / Acetal & Nylon / PA', 'Specify the exact grade, filled or unfilled condition and moisture acceptance. For PA, agree conditioning and inspection requirements where moisture-related dimensional change matters.'],
        ['PEEK & PTFE', 'Identify the exact formulation and any reinforcement or filler. Provide temperature, chemical exposure, load and dimensional requirements for review.'],
        ['ABS, Polycarbonate / PC & PMMA / Acrylic', 'Define grade and color, cosmetic surfaces and any optical or transparency requirements. Clear appearance, polished edges and optical performance require separate acceptance criteria.'],
      ] },
      { id: 'components', title: 'Typical Engineering Plastics Components', intro: 'Explore illustrated component geometries for one-off and batch enquiries. Include any application-specific qualifications with your requirements.', items: [
        ['Bushings, sleeves & spacers', 'Turned bores, shoulders and mating diameters with fit, wall thickness and assembly conditions defined.'],
        ['Guides, wear pads & fixtures', 'Milled profiles, slots and mounting patterns reviewed against contact conditions and locating requirements.'],
        ['Housings, covers & machined blocks', 'Pockets, thin sections and multi-side holes reviewed for wall stability, appearance and assembly access.'],
      ], link: ['/services/cnc-machining/', 'Explore milling and turning'] },
      { id: 'processes', title: 'CNC Machining Processes', intro: 'Select the machining route for the polymer grade, stock form, geometry and workholding requirements, with heat and stock removal considered during review.', items: [
        ['CNC Milling / 3-Axis', 'Accessible faces, profiles, slots, pockets and mounting holes on guides, fixtures and blocks.'],
        ['CNC Turning', 'Bores, shoulders, grooves and mating diameters for bushings, sleeves and spacers.'],
        ['3+2-Axis Milling', 'Fixed-angle positioning for inclined and multi-side features; rotary axes remain stationary during cutting.'],
        ['Simultaneous 5-Axis', 'Coordinated linear and rotary motion where complex surfaces and tool access justify the route for the specific polymer part.'],
        ['Stock removal & conditioning', 'Review thin walls, clamping and any intermediate conditioning or stress-relief request. These steps are confirmed for the specific grade, not universally applied.'],
      ], link: ['/services/cnc-machining/', 'Explore machining capabilities'] },
      { id: 'quality', title: 'Tolerances & Quality Control', intro: 'Agree the inspection environment and delivered material state. Moisture uptake and internal stress can affect dimensional stability; the review must consider the particular polymer and stock.', items: [
        ['Measurement conditions', 'Specify temperature, humidity or conditioning state where required. Define when measurements are taken and which dimensions control assembly.'],
        ['Functional acceptance', 'Identify free-state dimensions, installed fits, seal contact and load conditions. Avoid applying metal-part tolerances without a material-specific feasibility review.'],
        ['Inspection reports', 'Identify critical dimensions and request first-part or batch dimensional reports. Measurement methods, conditioning state, coverage and document availability are agreed before production.'],
      ], link: ['/quality/', 'Discuss dimensional acceptance'] },
      { id: 'finishing', title: 'Surface Finishing', intro: 'Specify plastic-part acceptance directly rather than copying a metal plating or anodizing specification. Additional finishing and cleaning processes are agreed per grade and application.', items: [
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
