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

  /* 默认（亮色）样式：浅灰背景 */
  .skill-card {
    flex: 1;
    min-width: 240px;
    padding: 14px 18px;
    border-radius: 18px;
    border: 1px solid rgba(148,163,184,0.4);
    background: #f3f4f6;              /* 浅灰 */
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

  /* ✅ 和大部分 Hugo / Academic 主题兼容的暗色标记：
     - html[data-theme="dark"]
     - html.dark
     - body.dark
  */
  html[data-theme="dark"] .skill-card,
  html.dark .skill-card,
  body.dark .skill-card {
    background: #111827;              /* 深色卡片背景 */
    border-color: rgba(148,163,184,0.3);
  }

  /* 兜底：如果主题没加 class，只靠系统深色模式 */
  @media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .skill-card,
    body:not([data-theme="light"]) .skill-card {
      background: #111827;
      border-color: rgba(148,163,184,0.3);
    }
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
