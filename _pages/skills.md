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

  /* 默认（亮色模式）样式 */
  .skill-card {
    flex: 1;
    min-width: 240px;
    padding: 14px 18px;
    border-radius: 18px;
    /* 亮色模式：白色背景，浅灰色边框 */
    background: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .skill-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .skill-card h3 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    color: #1e293b;
  }

  .skill-card ul {
    margin: 0;
    padding-left: 1.2em;
  }

  .skill-card li {
    margin: 4px 0;
    color: #475569;
  }

  /* 深色模式样式 - 使用主题的正确选择器 */
  html[data-theme="dark"] .skill-card {
    /* 深色模式：比背景色浅一些，形成对比 */
    background: #5a5a5a;
    border: 1px solid #6b6b6b;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  html[data-theme="dark"] .skill-card:hover {
    background: #636363;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  }

  html[data-theme="dark"] .skill-card h3 {
    color: #f1f5f9;
  }

  html[data-theme="dark"] .skill-card li {
    color: #e2e8f0;
  }
</style>


<div class="skills-grid">
  <!-- First Row -->
  <div class="skill-card">
    <h3> Field Experimentation</h3>
    <ul>
      <li>Hydrological monitoring device usage</li>
      <li>On-site water quality monitoring</li>
      <li>Multi-depth soil profile & coring sampling</li>
      <li>Ecosystem GHG sampling (chamber&flux)</li>
    </ul>
  </div>
  
  <div class="skill-card">
    <h3> Nutrient Transformation</h3>
    <ul>
      <li>¹⁵N isotopic tracing method</li>
      <li>Anaerobic and aerobic transformation assays of soil nutrients</li>
    </ul>
  </div>
  
  <div class="skill-card">
    <h3> Soil Physicochemical Measurement</h3>
    <ul>
      <li>Soil enzyme activity assays</li>
      <li>Soil aggregate and stability measurement</li>
      <li>Sediment incubation</li>
      <li>Soil sesquioxide quantification</li>
      <li>Nutrient fractionation separation (C, N, P)</li>
    </ul>
  </div>

  <!-- Second Row -->
  <div class="skill-card">
    <h3> Microbial & Genetic Analysis</h3>
    <ul>
      <li>16S rRNA amplicon sequencing</li>
      <li>qPCR (Quantitative Polymerase Chain Reaction)</li>
      <li>QIIME2 analysis: phylogeny, QC & visualization</li>
      <li>Functional gene annotation & analysis</li>
    </ul>
  </div>
  
  <div class="skill-card">
    <h3> Instrumental Operation & Maintenance</h3>
    <ul>
      <li>Automated & continuous flow analyzers</li>
      <li>UV-Vis spectroscopy</li>
      <li>HPLC-MS-MS</li>
      <li>CRDS</li>
    </ul>
  </div>
  
  <div class="skill-card">
    <h3> Software Skills</h3>
    <ul>
      <li>R</li>
      <li>ArcGIS</li>
      <li>Matlab</li>
      <li>STATA</li>
    </ul>
  </div>
</div>

---

## Detail

### Field Experimentation

- **Hydrological monitoring device usage**: Design and fabrication of portable rainfall simulators and field study of rainfall-induced erosion processes
- **On-site water quality monitoring**: Regular cross-sectional sampling and on-site analytical testing in wastewater treatment wetlands and mesocosm wetlands
- **Multi-depth soil profile & coring sampling**: Soil profile excavation and intact core collection
- **Ecosystem GHG sampling (chamber & flux)**: GHG collection from soil and constructed wetland water surface using chamber method; site selection and data acquisition with eddy covariance towers and greenhouse gas analyzers in the field

### Nutrient Transformation

- **¹⁵N isotopic tracing method**: Quantification of DNRA, anammox, and denitrification processes in soil
- **Anaerobic and aerobic transformation assays of soil nutrients**: Measurement of nitrification and denitrification rates in sediments

### Soil Physicochemical Measurement

- **Soil enzyme activity assays**: Extracellular enzymes related to C, N, and P transformation in soil
- **Soil aggregate and stability measurement**: Analysis of soil aggregates and their breakdown mechanisms (Le Bissonnais method)
- **Sediment incubation**: Pre-incubation for anaerobic-aerobic process transitions in soil
- **Soil sesquioxide quantification**: Quantification of sesquioxides (Fe, Al, and Mn) related to soil stability
- **Nutrient fractionation separation (C, N, P)**: Available nitrogen and phosphorus; various organic carbon fractions; soil microbial biomass C, N, and P

### Microbial & Genetic Analysis

- **16S rRNA amplicon sequencing**: Calculation of microbial diversity indices (α-diversity, β-diversity)
- **qPCR (Quantitative Polymerase Chain Reaction)**: Absolute quantification of functional genes (e.g., genes related to nitrification and denitrification)
- **QIIME2 analysis: phylogeny, QC & visualization**: Sequence quality control, denoising, clustering analysis, phylogenetic tree construction, diversity statistical analysis (PCoA, NMDS) and visualization; data mining and graphical visualization using R
- **Functional gene annotation & analysis**: Metabolic function prediction based on Tax4Fun2/PICRUSt2 and correlation analysis between microbial community functions and environmental factors

### Instrumental Operation & Maintenance

- **Automated & continuous flow analyzers**: Automated continuous flow analysis for different components of nutrients (C, N, P, etc.) in water samples and soil extracts
- **UV-Vis spectroscopy**: Spectrophotometric determination of dissolved organic carbon, inorganic nitrogen, and other parameters
- **HPLC-MS/MS**: Determination of antibiotics
- **CRDS (Cavity Ring-Down Spectroscopy)**: High-precision monitoring and isotopic analysis of greenhouse gases (CO₂, CH₄, N₂O)
