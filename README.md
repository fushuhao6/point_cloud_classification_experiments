# Point Cloud Classification Experiment Data and Interface

This repository contains the code and data for our three experiments in paper 
[Hierarchical Abstraction Enables Human-Like 3D Object Recognition in Deep Learning Models](https://arxiv.org/abs/2507.09830)

---

## Project Structure

```
.
├── data/
│
├── experiments/
│   ├── index.js                # Main experiment JS file
│   ├── Stimuli_upright/        # Experiment 1A stimuli
│   ├── Stimuli_inverted/       # Experiment 1B stimuli
│   ├── Stimuli_lego_like/      # Experiment 2 stimuli
│   ├── Stimuli_scrambled/      # Experiment 3 stimuli
│   └── ... 
│
└── README.md
```

---

## Experiments Overview

| Experiment Name | EXPERIMENT_NAME | Description |
|-----------------|-----------------|-------------|
| Experiment 1A   | `upright`       | Upright object condition |
| Experiment 1B   | `inverted`      | Inverted object condition |
| Experiment 2    | `lego_like`     | Lego-like voxelized objects |
| Experiment 3    | `scrambled`     | Scrambled object condition |

---

## Switching Between Experiments

To switch which experiment is run, edit the following file:

```
experiments/index.js
```

Locate the `EXPERIMENT_NAME` variable and set it to **one** of the following values:

```js
const EXPERIMENT_NAME = "upright";   // Experiment 1A
const EXPERIMENT_NAME = "inverted";  // Experiment 1B
const EXPERIMENT_NAME = "lego_like"; // Experiment 2
const EXPERIMENT_NAME = "scrambled"; // Experiment 3
```

Only one experiment should be active at a time.
