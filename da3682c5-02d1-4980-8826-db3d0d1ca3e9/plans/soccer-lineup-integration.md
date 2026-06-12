# Soccer Lineup Integration Plan

## Objective
Elevate the visual quality of match analysis by replacing the current list-based lineup view with an interactive, tactical pitch representation using the `react-soccer-lineup` library.

## Implementation Steps

### 1. Dependency Installation
- **Action:** Install the library.
- **Command:** `npm install react-soccer-lineup`

### 2. Data Mapping Utility
- **Goal:** Convert API-Football JSON structures (`home_xi`, `away_xi`) into the categorized `squad` object required by the library (`gk`, `df`, `cm`, etc.).
- **Logic:**
    - `G` -> `gk` (Goalkeeper)
    - `D` -> `df` (Defenders)
    - `M` -> `cm` or `cdm` (Midfielders)
    - `F` -> `fw` (Forwards)
- **Refinement:** Use the `grid` field from the API data (if available) or basic position codes to fine-tune placement.

### 3. Refactor `MatchLineup.jsx`
- **Component Update:** 
    - Create a toggle or tabs to switch between "Pitch View" (using the library) and "List View" (the current compact list).
    - Design the pitch to use the **Turquoise (`#14b8a6`)** pattern.
    - Set Home Jerseys to **Navy (`#0f172a`)** and Away Jerseys to **Blue (`#3b82f6`)** or a contrasting white.
- **Responsive Handling:** Ensure the pitch scales correctly within the Ant Design Card container using the `size="responsive"` prop.

### 4. Verification & Testing
- **Visual Check:** Ensure player names and numbers are readable on the pitch.
- **Formation Accuracy:** Verify that a 4-3-3 formation looks like a 4-3-3 on the interactive pitch.
- **Fallback:** Ensure the component handles missing lineup data gracefully without crashing.

## Benefits
- Provides an "EAFC/FIFA" professional broadcasting feel.
- Allows users to quickly grasp tactical setups at a glance.
- Maintains theme consistency with turquoise/navy accents.
