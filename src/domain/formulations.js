export const paracetamolSuspensionMission = Object.freeze({
  id: "paracetamol-suspension-foundation",
  title: "Stage 1: Paracetamol Suspension",
  patient: {
    condition: "Fever and pain",
    initialHealth: 45,
  },
  learningObjectives: [
    "Verify the prescription before preparation",
    "Reject unlabelled or hazardous material",
    "Follow the simulated extemporaneous-dispensing sequence",
    "Complete packaging, labeling, and counseling checks",
  ],
  ingredients: [
    { id: "api", label: "Paracetamol API", color: 0x62d9ff, role: "active ingredient" },
    { id: "wetting", label: "Wetting vehicle", color: 0x8ff0c9, role: "dispersion aid" },
    { id: "suspending", label: "Suspending agent", color: 0xb7a7ff, role: "physical stability" },
    { id: "flavour", label: "Flavour", color: 0xffd166, role: "palatability" },
    { id: "vehicle", label: "Purified water vehicle", color: 0x6fb1ff, role: "final vehicle" },
    { id: "poison", label: "Unlabelled corrosive", color: 0xff3158, role: "contaminant", hazard: true },
  ],
  selectionOrder: ["api", "wetting", "suspending", "flavour", "vehicle"],
  compoundingSteps: [
    { id: "triturate", label: "Reduce and homogenize powder" },
    { id: "levigate", label: "Levigate to a smooth paste" },
    { id: "dilute", label: "Incorporate by geometric dilution" },
    { id: "finish", label: "Complete vehicle and homogenize" },
    { id: "package", label: "Package in a suitable container" },
    { id: "label", label: "Label, counsel, and document" },
  ],
});
