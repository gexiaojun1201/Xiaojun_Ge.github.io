---
layout: archive
title: "Skills"
permalink: /skills/
author_profile: true
---

{% include base_path %}


## Summary

<style>
  .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 20px;
  }

  /* 默认（亮色）样式 */
  .skill-card {
    flex: 1;
    min-width: 240px;
    padding: 14px 18px;
    border-radius: 18px;
    border: 1px solid rgba(148,163,184,0.4);
    background: #f3f4f6;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  .skill-card h3 {
    margin: 0 0 6px 0;
    font-size: 1rem;
  }

  .skill-card ul {
    margin: 0;
    padding-left: 1.1em;
  }

  .skill-card li {
    margin: 0;
  }

  /* 深色模式 - 多种选择器组合确保兼容性 */
  [data-theme="dark"] .skill-card,
  .dark .skill-card,
  html[data-theme="dark"] .skill-card,
  html.dark .skill-card,
  body[data-theme="dark"] .skill-card,
  body.dark .skill-card,
  [class*="dark"] .skill-card {
    background: #1f2937 !important;  /* 使用 !important 确保优先级 */
    border-color: rgba(148,163,184,0.3) !important;
  }

  /* 系统深色模式兜底 */
  @media (prefers-color-scheme: dark) {
    .skill-card {
      background: #1f2937;
      border-color: rgba(148,163,184,0.3);
    }
  }

  /* 针对 Academic 主题的特定选择器 */
  .dark-mode .skill-card,
  #dark-mode .skill-card {
    background: #1f2937 !important;
    border-color: rgba(148,163,184,0.3) !important;
  }
</style>


<div class="skills-grid">

  <div class="skill-card">
    <h3>🌿 Field Work</h3>
    <ul>
      <li>Hydrological monitoring</li>
      <li>Soil sampling</li>
      <li>GHG flux measurement</li>
    </ul>
  </div>

  <div class="skill-card">
    <h3>🔬 Laboratory</h3>
    <ul>
      <li>¹⁵N isotope tracing</li>
      <li>Enzyme assays</li>
      <li>Nutrient fractionation</li>
    </ul>
  </div>

  <div class="skill-card">
    <h3>🔭 Instrumentation</h3>
    <ul>
      <li>LC-MS/MS</li>
      <li>HPLC</li>
      <li>GC</li>
      <li>CRDS</li>
      <li>UV-Vis</li>
    </ul>
  </div>

  <div class="skill-card">
    <h3>🧬 Molecular Biology</h3>
    <ul>
      <li>16S rRNA sequencing</li>
      <li>qPCR</li>
      <li>QIIME2</li>
    </ul>
  </div>

  <div class="skill-card">
    <h3>💻 Computing</h3>
    <ul>
      <li>R</li>
      <li>GIS</li>
    </ul>
  </div>

</div>

===

## Detail

### Field Experimentation

- Hydrological monitoring device usage
- On-site water quality monitoring
- Multi-depth soil profile & coring sampling
- Soil/water GHG sampling (chamber, tower)

### Nutrient Transformation

- ¹⁵N isotopic tracing method
- Sediment incubation
- Nutrient fractionation separation (C, N, P)

### Soil Physicochemical Measurement

- Soil enzyme activity assays
- Soil aggregate and stability measurement
- Soil sesquioxide quantification

### Microbial & Genetic Analysis

- 16S rRNA amplicon sequencing
- qPCR (Quantitative Polymerase Chain Reaction)
- QIIME2 analysis: phylogeny, QC, visualization
- Functional gene annotation & analysis

### Instrumental Operation & Maintenance

- Automated & continuous flow analyzers
- UV-Vis spectroscopy
- CRDS (Cavity Ring-Down Spectroscopy)
- Mass spectrometry
- HPLC (High-performance liquid chromatography)
- LC-MS/MS
- Gas Chromatography

### Software Skills

- R programming
- GIS applications
