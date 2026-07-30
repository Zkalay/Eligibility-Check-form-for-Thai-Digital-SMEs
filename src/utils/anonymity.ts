/**
 * Utility functions for ensuring research participant anonymity & PDPA compliance
 */

export function generateResearchId(): string {
  const year = new Date().getFullYear();
  const randomHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `TH-AI-SME-${year}-${randomHex}${randomNum}`;
}

export function generatePseudonym(): string {
  const prefixes = ['Alpha', 'Nexus', 'Apex', 'Vanguard', 'Synergy', 'Orion', 'Zenith', 'Pulse', 'Aether', 'Quantum', 'Starlight', 'Catalyst', 'Hyperion', 'Vertex'];
  const suffixes = ['Digital', 'Tech Labs', 'Solutions', 'Media', 'Analytics', 'Studios', 'Innovations', 'Interactive', 'DataWorks', 'Systems', 'Cloud', 'Creative'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `Firm ${prefix} ${suffix} (Pseudonym)`;
}

export function generateRefNumber(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const seq = Math.floor(100 + Math.random() * 900);
  return `BU-ACAP-${dateStr}-${seq}`;
}
